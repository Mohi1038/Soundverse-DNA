from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import dna, dna_profile
from app.database import engine
from app import models
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Soundverse DNA API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to create database tables, but don't fail if database is not available
try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.warning(f"Could not create database tables: {e}")
    logger.info("App will start without database connection")

app.include_router(dna.router, prefix="/api")
app.include_router(dna_profile.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Soundverse DNA API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is running"} 