# Backend (FastAPI)

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Development

```bash
uvicorn app.main:app --reload
```

## Database (PostgreSQL)

- Default connection: `postgresql://postgres:postgres@localhost:5432/soundverse`
- Use Docker or your own PostgreSQL instance. 