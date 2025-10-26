import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_ENV = os.getenv("APP_ENV", "production").lower()
    DEBUG = APP_ENV != "production"

    SECRET_KEY = "supersecretkey123"
    JWT_SECRET_KEY = SECRET_KEY

    SQLALCHEMY_DATABASE_URI = os.getenv("postgresql://postgres:postgres@localhost:5432/fast01")
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    OTP_TTL = int(os.getenv("OTP_TTL", "300"))
    OTP_COOLDOWN = int(os.getenv("OTP_COOLDOWN", "45"))
    OTP_MAX_ATTEMPTS = int(os.getenv("OTP_MAX_ATTEMPTS", "5"))

    CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")

    ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 12))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 30))

settings = Settings()
