from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from collections import defaultdict
from pathlib import Path

from qdrant_client import models


BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.config import get_settings  # noqa: E402
from app.ingestion.markdown import (  # noqa: E402
    BookChunk,
    chunk_document,
    discover_book_files,
    load_document,
)
from app.services.embeddings import GeminiEmbeddingService  # noqa: E402
from app.services.qdrant_service import QdrantService  # noqa: E402


logger = logging.getLogger("ingest_book")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Index Docusaurus book content in Qdrant")
    parser.add_argument("--docs-path", type=Path, help="Override the configured book docs path")
    parser.add_argument(
        "--recreate",
        action="store_true",
        help="Explicitly delete and recreate the configured Qdrant collection",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and chunk the book without calling Gemini or Qdrant",
    )
    return parser.parse_args()


async def ingest(*, docs_path: Path | None, recreate: bool, dry_run: bool) -> None:
    settings = get_settings()
    docs_root = (docs_path or settings.book_docs_path).resolve()
    if not docs_root.is_dir():
        raise FileNotFoundError(f"Book docs directory does not exist: {docs_root}")

    files = discover_book_files(docs_root)
    chunks: list[BookChunk] = []
    file_chunk_counts: dict[str, int] = {}
    for file_path in files:
        document = load_document(file_path, docs_root)
        document_chunks = chunk_document(
            document,
            chunk_size=settings.rag_chunk_size,
            overlap=settings.rag_chunk_overlap,
        )
        chunks.extend(document_chunks)
        file_chunk_counts[document.source_file] = len(document_chunks)

    logger.info("Discovered %s book files", len(files))
    logger.info("Created %s searchable chunks", len(chunks))
    if dry_run:
        for source_file, count in file_chunk_counts.items():
            logger.info("%s: %s chunks", source_file, count)
        return

    embeddings = GeminiEmbeddingService(settings)
    qdrant = QdrantService(settings)
    try:
        await qdrant.ensure_collection(recreate=recreate)

        chunks_by_source: dict[str, list[BookChunk]] = defaultdict(list)
        for chunk in chunks:
            chunks_by_source[chunk.source_file].append(chunk)

        uploaded = 0
        for source_file, source_chunks in chunks_by_source.items():
            await qdrant.delete_source(source_file)
            for start in range(0, len(source_chunks), settings.rag_embedding_batch_size):
                batch = source_chunks[start : start + settings.rag_embedding_batch_size]
                vectors = await embeddings.embed_documents([chunk.text for chunk in batch])
                points = [
                    models.PointStruct(
                        id=chunk.id,
                        vector=vector,
                        payload={
                            "text": chunk.text,
                            "title": chunk.title,
                            "section": chunk.section,
                            "path": chunk.path,
                            "source_file": chunk.source_file,
                            "module": chunk.module,
                            "chunk_index": chunk.chunk_index,
                            "embedding_model": settings.gemini_embedding_model,
                        },
                    )
                    for chunk, vector in zip(batch, vectors, strict=True)
                ]
                await qdrant.upsert(points)
                uploaded += len(points)
                logger.info("Uploaded %s/%s vectors", uploaded, len(chunks))
    finally:
        await qdrant.close()

    logger.info("Ingestion complete: %s files, %s vectors", len(files), uploaded)


def main() -> None:
    args = parse_args()
    settings = get_settings()
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    asyncio.run(
        ingest(
            docs_path=args.docs_path,
            recreate=args.recreate,
            dry_run=args.dry_run,
        )
    )


if __name__ == "__main__":
    main()

