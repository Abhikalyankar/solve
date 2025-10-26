from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from database import get_db
from models import User
from utils import (
    validate_phone, create_and_store_otp, can_send_otp, verify_otp
)
from config import settings
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/api", tags=["Auth"])

# ============================================================================
# 🔧 Helper — Create Flask-compatible JWT tokens
# ============================================================================
def create_flask_compatible_token(user_id: int, phone_number: str, hours=12):
    payload = {
        "user_id": user_id,  # ✅ Flask expects this field
        "phone_number": phone_number,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=hours),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY)


# ============================================================================
# 🔍 Health Check
# ============================================================================
@router.get("/health")
async def health():
    return {"status": "ok", "env": settings.APP_ENV}


# ============================================================================
# 📱 Send OTP
# ============================================================================
@router.post("/otp/send-otp/")
async def send_otp(payload: dict, request: Request):
    phone_raw = payload.get("phone_number")
    if not phone_raw:
        raise HTTPException(400, "Phone number is required")

    try:
        phone = validate_phone(phone_raw)
    except Exception as e:
        raise HTTPException(400, str(e))

    if not can_send_otp(phone):
        raise HTTPException(429, "Please wait before requesting another OTP.")

    code = create_and_store_otp(phone)
    print(f"📱 OTP for {phone}: {code}")
    return {"status": "ok", "cooldown_seconds": settings.OTP_COOLDOWN}


# ============================================================================
# 🧾 Register User (Verify OTP)
# ============================================================================
@router.post("/user-registration/verify-otp/")
async def verify_register(payload: dict, db: Session = Depends(get_db)):
    first = payload.get("first_name")
    phone_raw = payload.get("phone_number")
    otp = payload.get("otp")

    if not (first and phone_raw and otp):
        raise HTTPException(400, "Missing required fields")

    phone = validate_phone(phone_raw)
    if not verify_otp(phone, otp):
        raise HTTPException(400, "Invalid OTP")

    # Check if user exists
    user = db.query(User).filter(User.phone_number == phone).first()
    if not user:
        user = User(first_name=first, phone_number=phone)
        db.add(user)
        db.commit()
        db.refresh(user)

    # ✅ Generate Flask-compatible JWTs
    tokens = {
        "access": create_flask_compatible_token(user.id, user.phone_number, hours=12),
        "refresh": create_flask_compatible_token(user.id, user.phone_number, hours=720),
    }

    return {
        "success": True,
        "user": user.to_dict(),
        "tokens": tokens,
        "message": "Registration successful",
    }


# ============================================================================
# 🔑 Login (Verify OTP)
# ============================================================================
@router.post("/login/")
async def login(payload: dict, db: Session = Depends(get_db)):
    phone_raw = payload.get("phone_number")
    otp = payload.get("otp")

    if not (phone_raw and otp):
        raise HTTPException(400, "Phone number and OTP required")

    phone = validate_phone(phone_raw)
    if not verify_otp(phone, otp):
        raise HTTPException(400, "Invalid OTP")

    user = db.query(User).filter(User.phone_number == phone, User.is_active == True).first()
    if not user:
        raise HTTPException(404, "User not found")

    # ✅ Generate Flask-compatible JWTs
    tokens = {
        "access": create_flask_compatible_token(user.id, user.phone_number, hours=12),
        "refresh": create_flask_compatible_token(user.id, user.phone_number, hours=720),
    }

    return {
        "success": True,
        "user": user.to_dict(),
        "tokens": tokens,
        "message": "Login successful",
    }


# ============================================================================
# 🧩 Authenticated User Info
# ============================================================================
@router.get("/me/")
async def me(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid token")

    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        return {"user_id": decoded.get("user_id"), "phone_number": decoded.get("phone_number")}
    except Exception as e:
        print("❌ Token decode failed:", e)
        raise HTTPException(401, "Invalid or expired token")
