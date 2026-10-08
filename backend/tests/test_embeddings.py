import math

from google.genai import errors

from app.services.embeddings import GeminiEmbeddingService, _is_retryable_embedding_error


def test_normalize_returns_unit_vector() -> None:
    vector = GeminiEmbeddingService._normalize([3.0, 4.0])
    magnitude = math.sqrt(sum(value * value for value in vector))
    assert magnitude == 1.0


def test_rate_limit_errors_are_retryable() -> None:
    error = errors.ClientError(429, {"error": {"code": 429, "status": "RESOURCE_EXHAUSTED"}})

    assert _is_retryable_embedding_error(error) is True


def test_permanent_client_errors_are_not_retryable() -> None:
    error = errors.ClientError(400, {"error": {"code": 400, "status": "INVALID_ARGUMENT"}})

    assert _is_retryable_embedding_error(error) is False
