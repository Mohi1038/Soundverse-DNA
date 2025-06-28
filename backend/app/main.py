from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import dna, dna_profile
from app.database import engine, DATABASE_URL
from app import models
import logging
import os

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

# Drop and recreate all tables to fix schema issues
try:
    # Drop all tables first
    models.Base.metadata.drop_all(bind=engine)
    logger.info("Dropped all existing tables")
    
    # Create all tables with new schema
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully with new schema")
except Exception as e:
    logger.warning(f"Could not recreate database tables: {e}")
    logger.info("App will start without database connection")

app.include_router(dna.router, prefix="/api")
app.include_router(dna_profile.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Soundverse DNA API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.get("/debug/database")
def debug_database():
    return {
        "database_url": DATABASE_URL,
        "env_database_url": os.getenv("DATABASE_URL", "Not set"),
        "host": "aws-0-ap-south-1.pooler.supabase.com" if "pooler.supabase.com" in DATABASE_URL else "old_host"
    } 