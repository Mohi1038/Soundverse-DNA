from pydantic import BaseModel

class DNAArtist(BaseModel):
    id: int
    name: str
    image_url: str
    genre: str
    description: str
    audio_preview: str

    class Config:
        orm_mode = True 