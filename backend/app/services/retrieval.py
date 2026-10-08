from __future__ import annotations

import logging

from app.config import Settings
from app.schemas import RetrievedChunk
from app.services.embeddings import GeminiEmbeddingService
from app.services.qdrant_service import QdrantService


logger = logging.getLogger(__name__)


class RetrievalService:
    def __init__(
        self,
        settings: Settings,
        embeddings: GeminiEmbeddingService,
        qdrant: QdrantService,
    ) -> None:
        self.settings = settings
        self.embeddings = embeddings
        self.qdrant = qdrant

    async def retrieve(self, question: str) -> list[RetrievedChunk]:
        query_vector = await self.embeddings.embed_query(question)
        candidates = await self.qdrant.query(query_vector, limit=self.settings.rag_top_k)

        results: list[RetrievedChunk] = []
        for point in candidates:
            score = float(point.score)
            if score < self.settings.rag_score_threshold:
                continue
            payload = point.payload or {}
            text = str(payload.get("text", "")).strip()
            if not text:
                continue
            results.append(
                RetrievedChunk(
                    text=text,
                    title=str(payload.get("title", "Untitled chapter")),
                    section=str(payload.get("section", "Overview")),
                    path=str(payload.get("path", "")),
                    source_file=str(payload.get("source_file", "")),
                    chunk_index=int(payload.get("chunk_index", 0)),
                    score=score,
                )
            )

        results.sort(key=lambda chunk: chunk.score, reverse=True)
        logger.info(
            "Retrieved %s supported chunks from %s candidates",
            len(results),
            len(candidates),
        )
        return results

