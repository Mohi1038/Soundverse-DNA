#!/usr/bin/env python3
"""
Script to fix database schema issues by recreating tables
"""
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from app import models
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fix_database():
    """Drop and recreate all database tables"""
    try:
        logger.info("Starting database schema fix...")
        
        # Drop all tables first
        logger.info("Dropping all existing tables...")
        models.Base.metadata.drop_all(bind=engine)
        logger.info("✓ All tables dropped successfully")
        
        # Create all tables with new schema
        logger.info("Creating tables with new schema...")
        models.Base.metadata.create_all(bind=engine)
        logger.info("✓ All tables created successfully")
        
        logger.info("Database schema fix completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Error fixing database schema: {e}")
        return False

if __name__ == "__main__":
    success = fix_database()
    if success:
        print("✅ Database schema fixed successfully!")
        sys.exit(0)
    else:
        print("❌ Failed to fix database schema")
        sys.exit(1) 