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

def check_database_schema():
    """Check if the database schema is correct"""
    try:
        with engine.connect() as conn:
            # Check if dna_profiles table exists
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name = 'dna_profiles'
            """))
            
            if not result.fetchone():
                logger.warning("dna_profiles table does not exist")
                return False
            
            # Check if all required columns exist
            required_columns = ['user_id', 'profile_name', 'dna_sequence', 'is_active']
            for column in required_columns:
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'dna_profiles' 
                    AND column_name = '{column}'
                """))
                
                if not result.fetchone():
                    logger.warning(f"Column '{column}' missing from dna_profiles table")
                    return False
            
            logger.info("✓ Database schema is correct")
            return True
            
    except Exception as e:
        logger.error(f"Error checking database schema: {e}")
        return False

def migrate_database_safely():
    """Safely migrate database by adding missing columns without dropping data"""
    try:
        with engine.connect() as conn:
            # Check if user_id column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'dna_profiles' 
                AND column_name = 'user_id'
            """))
            
            if not result.fetchone():
                logger.info("Adding missing user_id column...")
                conn.execute(text("ALTER TABLE dna_profiles ADD COLUMN user_id VARCHAR(255)"))
                conn.execute(text("CREATE INDEX idx_dna_profiles_user_id ON dna_profiles(user_id)"))
                logger.info("✓ user_id column added")
            
            # Check if is_active column exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'dna_profiles' 
                AND column_name = 'is_active'
            """))
            
            if not result.fetchone():
                logger.info("Adding missing is_active column...")
                conn.execute(text("ALTER TABLE dna_profiles ADD COLUMN is_active BOOLEAN DEFAULT TRUE"))
                logger.info("✓ is_active column added")
            
            conn.commit()
            return True
            
    except Exception as e:
        logger.error(f"Error during safe migration: {e}")
        return False

def setup_database():
    """Setup database tables with proper error handling"""
    try:
        logger.info("Checking database schema...")
        
        # Check if schema is correct first
        if check_database_schema():
            logger.info("✓ Database schema is already correct, no changes needed")
            return True
        
        logger.warning("Database schema is incorrect. Attempting safe migration...")
        
        # Try safe migration first (preserves data)
        if migrate_database_safely():
            if check_database_schema():
                logger.info("✓ Database migrated safely, data preserved")
                return True
        
        logger.warning("Safe migration failed or insufficient. Recreating tables...")
        
        # Only recreate tables if safe migration didn't work
        logger.info("Dropping existing tables...")
        models.Base.metadata.drop_all(bind=engine)
        logger.info("✓ All tables dropped successfully")
        
        # Create all tables with new schema
        logger.info("Creating tables with new schema...")
        models.Base.metadata.create_all(bind=engine)
        logger.info("✓ All tables created successfully with new schema")
        
        # Verify the schema is correct
        if check_database_schema():
            logger.info("✓ Database schema verified successfully")
            return True
        else:
            logger.error("❌ Database schema verification failed")
            return False
        
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
                "has_user_id": any(col["name"] == "user_id" for col in columns),
                "has_is_active": any(col["name"] == "is_active" for col in columns),
                "schema_correct": check_database_schema()
            }
    except Exception as e:
        return {"error": str(e)}

@app.get("/fix-db")
def fix_database_endpoint():
    """Immediate database fix endpoint - call this right after deployment"""
    try:
        logger.info("Manual database fix triggered...")
        success = setup_database()
        if success:
            return {
                "message": "Database fixed successfully! You can now use the API.",
                "status": "success",
                "next_steps": "Try creating a DNA profile now"
            }
        else:
            return {
                "message": "Database fix failed",
                "status": "error",
                "next_steps": "Check the logs for more details"
            }
    except Exception as e:
        return {
            "message": f"Error fixing database: {str(e)}",
            "status": "error",
            "next_steps": "Contact support"
        } 