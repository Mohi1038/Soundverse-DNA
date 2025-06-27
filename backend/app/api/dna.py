from fastapi import APIRouter
from typing import List

router = APIRouter()

@router.get("/dna-artists")
def get_dna_artists():
    return [
        {
            "id": 1,
            "name": "Coldplay",
            "image_url": "https://placehold.co/100x100",
            "genre": "Pop",
            "description": "A sample pop artist.",
            "audio_preview": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            "id": 2,
            "name": "The Beatles",
            "image_url": "https://placehold.co/100x100",
            "genre": "Rock",
            "description": "A sample rock artist.",
            "audio_preview": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            "id": 3,
            "name": "The Smiths",
            "image_url": "https://placehold.co/100x100",
            "genre": "Rock",
            "description": "A sample rock artist.",
            "audio_preview": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        }
    ] 