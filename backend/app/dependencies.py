from __future__ import annotations

from functools import lru_cache

from app.config import get_settings
from app.services.answer_generation import GeminiAnswerService
from app.services.embeddings import GeminiEmbeddingService
from app.services.qdrant_service import QdrantService
from app.services.rag_service import RAGService
from app.services.retrieval import RetrievalService


@lru_cache
def get_embedding_service() -> GeminiEmbeddingService:
    return GeminiEmbeddingService(get_settings())


@lru_cache
def get_qdrant_service() -> QdrantService:
    return QdrantService(get_settings())


@lru_cache
def get_retrieval_service() -> RetrievalService:
    return RetrievalService(
        get_settings(),
        get_embedding_service(),
        get_qdrant_service(),
    )


@lru_cache
def get_answer_service() -> GeminiAnswerService:
    return GeminiAnswerService(get_settings())


@lru_cache
def get_rag_service() -> RAGService:
    return RAGService(get_retrieval_service(), get_answer_service())

