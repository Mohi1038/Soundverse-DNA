from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.get("/dna/", response_model=List[schemas.DNAArtist])
def read_dna_artists(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    artists = crud.get_dna_artists(db, skip=skip, limit=limit)
    return artists

@router.get("/dna/{artist_id}", response_model=schemas.DNAArtist)
def read_dna_artist(artist_id: int, db: Session = Depends(get_db)):
    artist = crud.get_dna_artist(db, artist_id=artist_id)
    if artist is None:
        raise HTTPException(status_code=404, detail="DNA Artist not found")
    return artist

@router.post("/dna/", response_model=schemas.DNAArtist)
def create_dna_artist(artist: schemas.DNAArtistCreate, db: Session = Depends(get_db)):
    return crud.create_dna_artist(db=db, artist=artist) 