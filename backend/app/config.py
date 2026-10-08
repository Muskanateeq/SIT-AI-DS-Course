from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_ROOT.parent


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    app_name: str = "AI & Data Science Book API"
    app_version: str = "0.1.0"
    environment: str = "development"
    log_level: str = "INFO"

    google_api_key: SecretStr | None = None
    gemini_embedding_model: str = "gemini-embedding-001"
    gemini_embedding_dimension: int = Field(default=768, ge=128, le=3072)
    gemini_generation_model: str = "gemini-3.8-flash"

    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: SecretStr | None = None
    qdrant_collection: str = "ai_data_science_book"

    rag_top_k: int = Field(default=5, ge=1, le=20)
    rag_score_threshold: float = Field(default=0.55, ge=0.0, le=1.0)
    rag_max_question_length: int = Field(default=2000, ge=50, le=10000)
    rag_chunk_size: int = Field(default=600, ge=100, le=2000)
    rag_chunk_overlap: int = Field(default=80, ge=0, le=500)
    rag_embedding_batch_size: int = Field(default=16, ge=1, le=100)

    allowed_origins: str = "http://localhost:3000"
    book_docs_path: Path = PROJECT_ROOT / "my-website" / "docs"

    model_config = SettingsConfigDict(
        env_file=BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("rag_chunk_overlap")
    @classmethod
    def validate_overlap(cls, value: int, info) -> int:
        chunk_size = info.data.get("rag_chunk_size", 600)
        if value >= chunk_size:
            raise ValueError("RAG_CHUNK_OVERLAP must be smaller than RAG_CHUNK_SIZE")
        return value

    @field_validator("book_docs_path", mode="before")
    @classmethod
    def expand_docs_path(cls, value: str | Path) -> Path:
        return Path(value).expanduser().resolve()

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip().rstrip("/") for origin in self.allowed_origins.split(",") if origin.strip()]

    def require_google_api_key(self) -> str:
        if self.google_api_key is None or not self.google_api_key.get_secret_value().strip():
            raise RuntimeError("GOOGLE_API_KEY is required for Gemini embeddings and answer generation")
        return self.google_api_key.get_secret_value()

    @property
    def qdrant_api_key_value(self) -> str | None:
        if self.qdrant_api_key is None:
            return None
        value = self.qdrant_api_key.get_secret_value().strip()
        return value or None


@lru_cache
def get_settings() -> Settings:
    return Settings()

