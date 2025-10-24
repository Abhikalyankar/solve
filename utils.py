import json
import time
import random
import phonenumbers
from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError
from email_validator import validate_email
import redis
from config import settings

# -----------------------------------------------------------------------------
# Redis client
# -----------------------------------------------------------------------------
try:
    r = redis.from_url(settings.REDIS_URL, decode_responses=True)
    r.ping()
    print("✅ Connected to Redis")
except Exception as e:
    print(f"❌ Redis connection failed: {e}")
    r = None

# -----------------------------------------------------------------------------
# JWT Token Generation (Flask & FastAPI Compatible)
# -----------------------------------------------------------------------------
def create_access_token(data: dict) -> str:
    """
    Create a short-lived access token that both Flask and FastAPI can decode.
    Includes `user_id` claim and expiry timestamp.
    """
    if not data.get("user_id"):
        raise ValueError("user_id is required for access token")

    payload = {
        "user_id": data["user_id"],
        "type": "access",
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")
    return token


def create_refresh_token(data: dict) -> str:
    """
    Create a long-lived refresh token.
    Flask can use it to issue new access tokens later.
    """
    if not data.get("user_id"):
        raise ValueError("user_id is required for refresh token")

    payload = {
        "user_id": data["user_id"],
        "type": "refresh",
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")
    return token


def decode_token(token: str):
    """
    Decode JWT and return payload if valid; otherwise None.
    Flask and FastAPI compatible.
    """
    try:
        decoded = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        if "user_id" not in decoded:
            print("⚠️ Invalid payload: missing user_id")
            return None
        return decoded
    except ExpiredSignatureError:
        print("⚠️ Token expired")
        return None
    except JWTError as e:
        print(f"⚠️ Invalid token: {e}")
        return None
    except Exception as e:
        print(f"⚠️ Unexpected decode error: {e}")
        return None


# -----------------------------------------------------------------------------
# OTP (Phone-based Authentication)
# -----------------------------------------------------------------------------
def otp_key(phone: str) -> str:
    """Generate Redis key for storing OTP by phone number."""
    return f"otp:{phone}"


def validate_phone(phone_str: str) -> str:
    """Validate and normalize Indian phone numbers."""
    if not phone_str:
        raise ValueError("Phone number required")

    # Simple 10-digit Indian mobile format
    if len(phone_str) == 10 and phone_str[0] in "6789":
        return "+91" + phone_str

    # Use phonenumbers for any other format
    try:
        parsed = phonenumbers.parse(phone_str, "IN")
        if not phonenumbers.is_valid_number(parsed):
            raise ValueError("Invalid phone number")
        return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
    except Exception:
        raise ValueError("Invalid phone number")


def normalize_email(email: str):
    """Validate and normalize email (if provided)."""
    if not email:
        return None
    try:
        return validate_email(email).email
    except Exception:
        raise ValueError("Invalid email address")


def can_send_otp(phone: str) -> bool:
    """Rate-limit OTP requests per phone using Redis TTL."""
    if not r:
        print("⚠️ Redis unavailable, allowing OTP anyway")
        return True

    raw = r.get(otp_key(phone))
    if not raw:
        return True

    data = json.loads(raw)
    last_sent = data.get("last_sent", 0)
    cooldown = settings.OTP_COOLDOWN
    return (time.time() - last_sent) >= cooldown


def create_and_store_otp(phone: str) -> str:
    """Generate and store a 6-digit OTP in Redis with cooldown."""
    if not r:
        print("⚠️ Redis unavailable, generating OTP without persistence")
        return "000000"  # fallback for dev mode

    code = str(random.randint(100000, 999999))
    payload = {"code": code, "attempts": 0, "last_sent": time.time()}
    r.setex(otp_key(phone), settings.OTP_TTL, json.dumps(payload))
    print(f"📱 OTP for {phone}: {code}")
    return code


def verify_otp(phone: str, code: str) -> bool:
    """Verify the OTP entered by the user."""
    if not r:
        print("⚠️ Redis unavailable, skipping OTP verification")
        return True  # fallback for testing

    raw = r.get(otp_key(phone))
    if not raw:
        return False

    data = json.loads(raw)
    if data.get("code") != str(code):
        # Increment failed attempts
        data["attempts"] += 1
        ttl = r.ttl(otp_key(phone))
        if data["attempts"] >= settings.OTP_MAX_ATTEMPTS:
            r.delete(otp_key(phone))
            print(f"❌ OTP blocked for {phone}: too many attempts")
        else:
            r.setex(otp_key(phone), max(ttl, 1), json.dumps(data))
        return False

    # OTP is correct
    r.delete(otp_key(phone))
    print(f"✅ OTP verified successfully for {phone}")
    return True
