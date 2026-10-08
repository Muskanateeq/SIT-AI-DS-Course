# AI & Data Science Book with RAG

This workspace contains:

- `my-website/` — Docusaurus learning book with 97 syllabus-aligned chapters.
- `backend/` — FastAPI RAG API using Gemini embeddings and Qdrant.

## Local development

Frontend:

```powershell
cd my-website
$env:BOOK_API_URL="http://localhost:8000"
npm run start
```

The floating **Ask the book** widget is available on every page. It sends questions
to the FastAPI `/api/chat` endpoint and links returned citations back to book chapters.
Set `BOOK_API_URL` to the deployed backend URL when building for production.

Backend:

```powershell
cd backend
python -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
python scripts/ingest_book.py
uvicorn app.main:app --reload
```

See [backend/README.md](backend/README.md) for configuration, ingestion, API, testing, and evaluation details.

## Vercel deployment

The root `vercel.json` deploys the Docusaurus site and FastAPI API together with
Vercel Services. Requests under `/api` and `/health` go to FastAPI; all other
paths go to Docusaurus. Production builds use same-origin `/api/chat`, so Gemini
and Qdrant credentials remain server-side environment variables.
