from fastapi.testclient import TestClient

from app.dependencies import get_rag_service
from app.main import app
from app.schemas import ChatResponse, Source


class FakeRAGService:
    async def answer(self, question: str) -> ChatResponse:
        return ChatResponse(
            answer=f"Grounded answer for: {question}",
            grounded=True,
            sources=[
                Source(
                    title="Machine Learning",
                    section="Overview",
                    path="/docs/machine-learning",
                    score=0.9,
                )
            ],
        )


def test_health_endpoint() -> None:
    with TestClient(app) as client:
        response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_empty_question_is_rejected() -> None:
    with TestClient(app) as client:
        response = client.post("/api/chat", json={"question": "   "})
    assert response.status_code == 422


def test_chat_returns_structured_grounded_response() -> None:
    app.dependency_overrides[get_rag_service] = lambda: FakeRAGService()
    try:
        with TestClient(app) as client:
            response = client.post("/api/chat", json={"question": "What is ML?"})
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    payload = response.json()
    assert payload["grounded"] is True
    assert payload["sources"][0]["path"] == "/docs/machine-learning"

