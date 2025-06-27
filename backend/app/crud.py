from sqlalchemy.orm import Session
from app.models import DNAArtist
from app.schemas import DNAArtist as DNAArtistSchema

def get_dna_artists(db: Session):
    return db.query(DNAArtist).all() 