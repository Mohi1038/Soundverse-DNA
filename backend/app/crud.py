from sqlalchemy.orm import Session
from . import models, schemas

# DNA Artist CRUD operations
def get_dna_artists(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DNAArtist).offset(skip).limit(limit).all()

def get_dna_artist(db: Session, artist_id: int):
    return db.query(models.DNAArtist).filter(models.DNAArtist.id == artist_id).first()

def create_dna_artist(db: Session, artist: schemas.DNAArtistCreate):
    db_artist = models.DNAArtist(**artist.dict())
    db.add(db_artist)
    db.commit()
    db.refresh(db_artist)
    return db_artist

# DNA Profile CRUD operations
def get_dna_profiles(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.DNAProfile).filter(models.DNAProfile.user_id == user_id).offset(skip).limit(limit).all()

def get_dna_profile(db: Session, profile_id: int):
    return db.query(models.DNAProfile).filter(models.DNAProfile.id == profile_id).first()

def create_dna_profile(db: Session, profile: schemas.DNAProfileCreate):
    db_profile = models.DNAProfile(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def update_dna_profile(db: Session, profile_id: int, profile: schemas.DNAProfileBase):
    db_profile = db.query(models.DNAProfile).filter(models.DNAProfile.id == profile_id).first()
    if db_profile:
        for key, value in profile.dict().items():
            setattr(db_profile, key, value)
        db.commit()
        db.refresh(db_profile)
    return db_profile

def delete_dna_profile(db: Session, profile_id: int):
    db_profile = db.query(models.DNAProfile).filter(models.DNAProfile.id == profile_id).first()
    if db_profile:
        db.delete(db_profile)
        db.commit()
    return db_profile 