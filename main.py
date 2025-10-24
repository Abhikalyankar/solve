from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from database import Base, engine
from config import settings
from logger import init_logging

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SuperApp FastAPI Auth", version="1.0")

# Logging
logger = init_logging()
logger.info("🚀 Starting FastAPI Server")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "FastAPI Auth backend running", "env": settings.APP_ENV}
