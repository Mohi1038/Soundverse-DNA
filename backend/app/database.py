import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:jRySvXw2kyQzdV92@db.faguwrzzuyhmqamebdgf.supabase.co:5432/postgres")

# Convert to connection pooling URL for Supabase
if "supabase.co" in DATABASE_URL:
    # Use connection pooling for Supabase
    DATABASE_URL = DATABASE_URL.replace(":5432/", ":6543/")

# Create SQLAlchemy engine with connection pooling settings
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,  # Recycle connections every 5 minutes
    connect_args={
        "connect_timeout": 10,
        "application_name": "soundverse-dna-backend"
    }
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 