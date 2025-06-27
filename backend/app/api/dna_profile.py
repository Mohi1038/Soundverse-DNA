from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

router = APIRouter()

class ProfileData(BaseModel):
    creator: str
    description: str
    tags: list[str]
    dna_visibility: str
    price: str
    license: str
    tracks: str
    partner: str

@router.post('/api/dna-profile')
async def create_profile(data: ProfileData):
    print("Received data:", data)
    try:
        dsn = os.environ["DATABASE_URL"]
        conn = await asyncpg.connect(dsn=dsn)
        await conn.execute(
            """INSERT INTO dna_profiles
            (creator, description, tags, dna_visibility, price, license, tracks, partner)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)""",
            data.creator, data.description, data.tags,
            data.dna_visibility, data.price, data.license, data.tracks, data.partner
        )
        await conn.close()
        print("Inserted into database!")
        return {"status": "ok"}
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))