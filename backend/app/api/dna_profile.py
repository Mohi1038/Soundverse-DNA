from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.get("/dna-profiles/{user_id}", response_model=List[schemas.DNAProfile])
def read_dna_profiles(user_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    profiles = crud.get_dna_profiles(db, user_id=user_id, skip=skip, limit=limit)
    return profiles

@router.get("/dna-profiles/profile/{profile_id}", response_model=schemas.DNAProfile)
def read_dna_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = crud.get_dna_profile(db, profile_id=profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="DNA Profile not found")
    return profile

@router.post("/dna-profiles/", response_model=schemas.DNAProfile)
def create_dna_profile(profile: schemas.DNAProfileCreate, db: Session = Depends(get_db)):
    return crud.create_dna_profile(db=db, profile=profile)

@router.put("/dna-profiles/{profile_id}", response_model=schemas.DNAProfile)
def update_dna_profile(profile_id: int, profile: schemas.DNAProfileBase, db: Session = Depends(get_db)):
    updated_profile = crud.update_dna_profile(db=db, profile_id=profile_id, profile=profile)
    if updated_profile is None:
        raise HTTPException(status_code=404, detail="DNA Profile not found")
    return updated_profile

@router.delete("/dna-profiles/{profile_id}")
def delete_dna_profile(profile_id: int, db: Session = Depends(get_db)):
    profile = crud.delete_dna_profile(db=db, profile_id=profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="DNA Profile not found")
    return {"message": "DNA Profile deleted successfully"}