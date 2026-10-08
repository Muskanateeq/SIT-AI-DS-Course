from __future__ import annotations

import asyncio
import math
from collections.abc import Sequence

from google import genai
from google.genai import errors, types
from tenacity import retry, retry_if_exception, stop_after_attempt, wait_exponential

from app.config import Settings


class EmbeddingServiceError(RuntimeError):
    """Raised when Gemini cannot produce a valid embedding."""


def _is_retryable_embedding_error(exc: BaseException) -> bool:
    if isinstance(exc, errors.ClientError):
        return exc.code == 429
    return True


class GeminiEmbeddingService:
    """Generate compatible document and query vectors with Google Gemini."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._client: genai.Client | None = None

    @property
    def client(self) -> genai.Client:
        if self._client is None:
            self._client = genai.Client(api_key=self.settings.require_google_api_key())
        return self._client

    async def embed_query(self, question: str) -> list[float]:
        vectors = await asyncio.to_thread(self._embed_sync, [question], "RETRIEVAL_QUERY")
        return vectors[0]

    async def embed_documents(self, texts: Sequence[str]) -> list[list[float]]:
        if not texts:
            return []
        return await asyncio.to_thread(self._embed_sync, list(texts), "RETRIEVAL_DOCUMENT")

    def _embed_sync(self, texts: list[str], task_type: str) -> list[list[float]]:
        try:
            if self.settings.gemini_embedding_model == "gemini-embedding-001":
                response = self._embed_content(
                    model=self.settings.gemini_embedding_model,
                    contents=texts,
                    config=types.EmbedContentConfig(
                        task_type=task_type,
                        output_dimensionality=self.settings.gemini_embedding_dimension,
                    ),
                )
                embeddings = response.embeddings or []
            else:
                # Gemini Embedding 2 aggregates a raw list into one embedding, so
                # request each text independently to preserve one vector per chunk.
                embeddings = []
                for text in texts:
                    instruction = (
                        "Task: retrieve relevant documents. Query: "
                        if task_type == "RETRIEVAL_QUERY"
                        else "Title: AI and Data Science Book. Document: "
                    )
                    response = self._embed_content(
                        model=self.settings.gemini_embedding_model,
                        contents=f"{instruction}{text}",
                        config=types.EmbedContentConfig(
                            output_dimensionality=self.settings.gemini_embedding_dimension,
                        ),
                    )
                    embeddings.extend(response.embeddings or [])
        except Exception as exc:
            raise EmbeddingServiceError("Gemini embedding request failed") from exc

        if len(embeddings) != len(texts):
            raise EmbeddingServiceError(
                f"Expected {len(texts)} embeddings but Gemini returned {len(embeddings)}"
            )

        vectors: list[list[float]] = []
        for embedding in embeddings:
            values = list(embedding.values or [])
            if len(values) != self.settings.gemini_embedding_dimension:
                raise EmbeddingServiceError(
                    "Gemini returned an unexpected vector dimension: "
                    f"{len(values)} instead of {self.settings.gemini_embedding_dimension}"
                )
            vectors.append(self._normalize(values))
        return vectors

    @retry(
        retry=retry_if_exception(_is_retryable_embedding_error),
        stop=stop_after_attempt(6),
        wait=wait_exponential(multiplier=10, min=30, max=60),
        reraise=True,
    )
    def _embed_content(self, **kwargs):
        return self.client.models.embed_content(**kwargs)

    @staticmethod
    def _normalize(vector: list[float]) -> list[float]:
        magnitude = math.sqrt(sum(value * value for value in vector))
        if magnitude == 0:
            raise EmbeddingServiceError("Gemini returned a zero-length embedding")
        return [value / magnitude for value in vector]
