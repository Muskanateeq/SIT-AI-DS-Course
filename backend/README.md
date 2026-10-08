# AI & Data Science Book RAG Backend

FastAPI backend for answering questions strictly from the Docusaurus book. It uses Google Gemini text embeddings, Qdrant vector search, a retrieval relevance gate, grounded Gemini generation, and source citations.

## Architecture

```text
Docusaurus docs → Markdown parser → heading-aware chunks
                → Gemini embeddings → Qdrant

Question → Gemini query embedding → Qdrant top-K
         → score threshold
         → no evidence: exact refusal
         → evidence: grounded Gemini answer + book sources
```

## Requirements

- Python 3.11 or newer
- A Google Gemini API key
- Qdrant Cloud credentials or a local Qdrant instance

## Setup

From `backend/`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
```

Fill in `GOOGLE_API_KEY`. For Qdrant Cloud, also set `QDRANT_URL` and `QDRANT_API_KEY`. Never place either credential in Docusaurus client code.

To run Qdrant locally with Docker:

```powershell
docker run --name ai-book-qdrant -p 6333:6333 -p 6334:6334 -v qdrant_storage:/qdrant/storage qdrant/qdrant
```

## Index the book

First inspect parsing without using external services:

```powershell
python scripts/ingest_book.py --dry-run
```

Create or update the index:

```powershell
python scripts/ingest_book.py
```

The embedding client automatically backs off and resumes when Gemini returns a
temporary rate-limit response, so free-tier indexing may pause between batches.

To intentionally delete and rebuild the configured collection:

```powershell
python scripts/ingest_book.py --recreate
```

The normal ingestion path deletes and replaces chunks for each current source file, preventing duplicates. Use `--recreate` after deleting book files, changing embedding models/dimensions, or when a guaranteed clean rebuild is required.

## Run the API

```powershell
uvicorn app.main:app --reload
```

Endpoints:

- `GET /health`
- `POST /api/chat`
- Local OpenAPI UI: `http://localhost:8000/docs`

Request:

```json
{
  "question": "What is K-Nearest Neighbors?"
}
```

Grounded response:

```json
{
  "answer": "K-Nearest Neighbors ... [1]",
  "grounded": true,
  "sources": [
    {
      "title": "K-Nearest Neighbors",
      "section": "Concepts covered",
      "path": "/docs/machine-learning/k-nearest-neighbors",
      "score": 0.82
    }
  ]
}
```

Unsupported questions return the configured exact refusal with `grounded: false` and no sources.

## Connect the Docusaurus chatbot

The global chatbot widget reads the backend URL at Docusaurus build time. For local
development, the default is already `http://localhost:8000`. To use another API:

```powershell
cd ..\my-website
$env:BOOK_API_URL="https://your-api.example.com"
npm run build
```

Add the frontend origin to `ALLOWED_ORIGINS` in `backend/.env`. Keep Gemini and
Qdrant credentials only in the backend environment; never expose them through
Docusaurus configuration or browser code.

## Tests and evaluation

```powershell
pytest
python scripts/evaluate.py
```

Run the evaluation script while the API is running. Tune `RAG_SCORE_THRESHOLD` using supported and unsupported questions instead of assuming the default is correct.

## Important embedding rule

Documents and questions must always use the same model, dimension, and compatible task configuration. Changing `GEMINI_EMBEDDING_MODEL` or `GEMINI_EMBEDDING_DIMENSION` requires a full `--recreate` ingestion.
