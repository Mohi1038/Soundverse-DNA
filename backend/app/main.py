from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import dna, dna_profile
from app.database import engine, DATABASE_URL
from app import models
import logging
import os
from sqlalchemy import text

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

def setup_database():
    """Setup database tables with proper error handling"""
    try:
        logger.info("Setting up database tables...")
        
        # First, check if tables exist and have the right schema
        with engine.connect() as conn:
            # Check if dna_profiles table exists and has user_id column
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'dna_profiles' 
                AND column_name = 'user_id'
            """))
            
            if not result.fetchone():
                logger.warning("dna_profiles table missing user_id column. Recreating tables...")
                # Drop all tables first
                models.Base.metadata.drop_all(bind=engine)
                logger.info("✓ All tables dropped successfully")
                
                # Create all tables with new schema
                models.Base.metadata.create_all(bind=engine)
                logger.info("✓ All tables created successfully with new schema")
            else:
                logger.info("✓ Database schema is correct")
        
        return True
        
    except Exception as e:
        logger.error(f"Error setting up database: {e}")
        logger.warning("App will start without proper database setup")
        return False

@app.on_event("startup")
async def startup_event():
    """Run database setup on startup"""
    logger.info("Starting Soundverse DNA API...")
    setup_database()

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

@app.post("/debug/recreate-tables")
def recreate_tables():
    """Endpoint to manually recreate database tables"""
    try:
        success = setup_database()
        if success:
            return {"message": "Database tables recreated successfully", "status": "success"}
        else:
            return {"message": "Failed to recreate database tables", "status": "error"}
    except Exception as e:
        return {"message": f"Error recreating tables: {str(e)}", "status": "error"}

@app.get("/debug/check-schema")
def check_schema():
    """Check the current database schema"""
    try:
        with engine.connect() as conn:
            # Check dna_profiles table structure
            result = conn.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'dna_profiles' 
                ORDER BY ordinal_position
            """))
            
            columns = [{"name": row[0], "type": row[1]} for row in result.fetchall()]
            
            return {
                "table": "dna_profiles",
                "columns": columns,
                "has_user_id": any(col["name"] == "user_id" for col in columns)
            }
    except Exception as e:
        return {"error": str(e)} 