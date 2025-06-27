from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import dna, dna_profile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dna.router, prefix="/api")
app.include_router(dna_profile.router) 