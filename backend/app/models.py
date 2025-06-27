from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DNAArtist(Base):
    __tablename__ = "dna_artists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image_url = Column(String)
    genre = Column(String)
    description = Column(String)
    audio_preview = Column(String) 