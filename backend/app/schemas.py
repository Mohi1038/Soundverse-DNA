from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DNAArtistBase(BaseModel):
    name: str
    description: Optional[str] = None
    dna_sequence: str

class DNAArtistCreate(DNAArtistBase):
    pass

class DNAArtist(DNAArtistBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DNAProfileBase(BaseModel):
    profile_name: str
    dna_sequence: str
    is_active: bool = True

class DNAProfileCreate(DNAProfileBase):
    user_id: str

class DNAProfile(DNAProfileBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 