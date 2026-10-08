from app.schemas import REFUSAL_MESSAGE, RetrievedChunk
from app.services.rag_service import RAGService


class FakeRetrieval:
    def __init__(self, chunks: list[RetrievedChunk]) -> None:
        self.chunks = chunks

    async def retrieve(self, _: str) -> list[RetrievedChunk]:
        return self.chunks


class FakeAnswerGenerator:
    def __init__(self, answer: str) -> None:
        self.answer_text = answer

    async def generate(self, _: str, __: list[RetrievedChunk]) -> str:
        return self.answer_text


def sample_chunk(index: int, score: float = 0.9) -> RetrievedChunk:
    return RetrievedChunk(
        text=f"Evidence {index}",
        title="Machine Learning",
        section=f"Section {index}",
        path=f"/docs/machine-learning/section-{index}",
        source_file=f"docs/section-{index}.md",
        chunk_index=index,
        score=score,
    )


async def test_no_evidence_returns_exact_refusal() -> None:
    service = RAGService(FakeRetrieval([]), FakeAnswerGenerator("should not be called"))
    response = await service.answer("What is the weather?")

    assert response.grounded is False
    assert response.answer == REFUSAL_MESSAGE
    assert response.sources == []


async def test_only_cited_sources_are_returned() -> None:
    chunks = [sample_chunk(1), sample_chunk(2)]
    service = RAGService(
        FakeRetrieval(chunks),
        FakeAnswerGenerator("The book supports this answer [2]."),
    )
    response = await service.answer("Explain the topic")

    assert response.grounded is True
    assert response.answer == "The book supports this answer [1]."
    assert len(response.sources) == 1
    assert response.sources[0].section == "Section 2"


async def test_generator_refusal_remains_ungrounded() -> None:
    service = RAGService(
        FakeRetrieval([sample_chunk(1)]),
        FakeAnswerGenerator(REFUSAL_MESSAGE),
    )
    response = await service.answer("Unsupported detail")

    assert response.grounded is False
    assert response.sources == []


async def test_answer_without_valid_citations_is_refused() -> None:
    service = RAGService(
        FakeRetrieval([sample_chunk(1)]),
        FakeAnswerGenerator("An uncited answer must not be accepted as grounded."),
    )
    response = await service.answer("Explain the topic")

    assert response.grounded is False
    assert response.answer == REFUSAL_MESSAGE
    assert response.sources == []


async def test_source_style_citations_are_normalized() -> None:
    service = RAGService(
        FakeRetrieval([sample_chunk(1)]),
        FakeAnswerGenerator("The book supports this answer [SOURCE 1]."),
    )
    response = await service.answer("Explain the topic")

    assert response.grounded is True
    assert response.answer == "The book supports this answer [1]."
    assert len(response.sources) == 1
