import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # -------------------------------------------------------------------------
    # 🔐 SECURITY — Unified for ALL Backends (Auth + Chat)
    # -------------------------------------------------------------------------
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    # -------------------------------------------------------------------------
    # 🗄️ DATABASE — PostgreSQL shared by both services
    # -------------------------------------------------------------------------
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/superapp_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # -------------------------------------------------------------------------
    # 🌐 CORS — For React Native & Web
    # -------------------------------------------------------------------------
    CORS_ALLOWED_ORIGINS = os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:19006,http://localhost:3000,http://10.0.2.2:19006,http://10.214.135.184:19006"
    ).split(",")

    # -------------------------------------------------------------------------
    # 🔔 SOCKET.IO (Optional Redis Backend)
    # -------------------------------------------------------------------------
    SOCKET_MESSAGE_QUEUE = os.getenv("SOCKET_MESSAGE_QUEUE", "redis://localhost:6379/0")

    # -------------------------------------------------------------------------
    # 🧩 REDIS — Optional (for OTPs, rate limiting, etc.)
    # -------------------------------------------------------------------------
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    RATE_LIMIT_REDIS_URL = os.getenv("RATE_LIMIT_REDIS_URL", "redis://localhost:6379/1")

    # -------------------------------------------------------------------------
    # 🕒 TOKEN EXPIRATION (If you use access + refresh)
    # -------------------------------------------------------------------------
    ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 12))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 30))

    # -------------------------------------------------------------------------
    # 🌍 APP MODE
    # -------------------------------------------------------------------------
    APP_ENV = os.getenv("APP_ENV", "development")
    DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
