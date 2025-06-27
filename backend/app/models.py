from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from .database import Base

class DNAArtist(Base):
    __tablename__ = "dna_artists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    dna_sequence = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DNAProfile(Base):
    __tablename__ = "dna_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    profile_name = Column(String, index=True)
    dna_sequence = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 