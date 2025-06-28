#!/usr/bin/env python3
"""
Database fix script for Soundverse DNA
This script will fix the database schema issues by recreating tables
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database import DATABASE_URL
from app import models

def fix_database():
    """Fix the database schema by recreating tables"""
    print("🔧 Fixing database schema...")
    
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # Test connection
        with engine.connect() as conn:
            print("✓ Database connection successful")
            
            # Check current schema
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'dna_profiles' 
                AND column_name = 'user_id'
            """))
            
            if result.fetchone():
                print("✓ Database schema is already correct")
                return True
            
            print("⚠️  Database schema needs fixing...")
            
            # Drop all tables
            print("🗑️  Dropping existing tables...")
            models.Base.metadata.drop_all(bind=engine)
            print("✓ Tables dropped successfully")
            
            # Create all tables with correct schema
            print("🏗️  Creating tables with correct schema...")
            models.Base.metadata.create_all(bind=engine)
            print("✓ Tables created successfully")
            
            # Verify the fix
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'dna_profiles' 
                AND column_name = 'user_id'
            """))
            
            if result.fetchone():
                print("✅ Database schema fixed successfully!")
                return True
            else:
                print("❌ Database schema fix failed")
                return False
                
    except SQLAlchemyError as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def check_database():
    """Check the current database schema"""
    print("🔍 Checking database schema...")
    
    try:
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            # Check if dna_profiles table exists
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name = 'dna_profiles'
            """))
            
            if not result.fetchone():
                print("❌ dna_profiles table does not exist")
                return False
            
            # Check table structure
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'dna_profiles' 
                ORDER BY ordinal_position
            """))
            
            columns = result.fetchall()
            print("📋 Current dna_profiles table structure:")
            for col in columns:
                print(f"  - {col[0]}: {col[1]} ({'NULL' if col[2] == 'YES' else 'NOT NULL'})")
            
            # Check for user_id column
            has_user_id = any(col[0] == 'user_id' for col in columns)
            if has_user_id:
                print("✅ user_id column exists")
            else:
                print("❌ user_id column missing")
            
            return has_user_id
            
    except Exception as e:
        print(f"❌ Error checking database: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Soundverse DNA Database Fix Tool")
    print("=" * 40)
    
    # Check current state
    if check_database():
        print("\n✅ Database schema is correct!")
    else:
        print("\n⚠️  Database schema needs fixing...")
        
        # Ask for confirmation
        response = input("\nDo you want to fix the database schema? (y/N): ")
        if response.lower() in ['y', 'yes']:
            if fix_database():
                print("\n🎉 Database fixed successfully!")
            else:
                print("\n💥 Failed to fix database")
        else:
            print("\n⏭️  Skipping database fix") 