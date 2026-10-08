from __future__ import annotations

import re

from app.schemas import ChatResponse, REFUSAL_MESSAGE, RetrievedChunk, Source
from app.services.answer_generation import GeminiAnswerService
from app.services.retrieval import RetrievalService


SOURCE_MARKER = re.compile(r"\[(?:SOURCE\s+)?(\d+)]", re.IGNORECASE)


class RAGService:
    def __init__(
        self,
        retrieval: RetrievalService,
        answer_generator: GeminiAnswerService,
    ) -> None:
        self.retrieval = retrieval
        self.answer_generator = answer_generator

    async def answer(self, question: str) -> ChatResponse:
        chunks = await self.retrieval.retrieve(question)
        if not chunks:
            return self.refusal()

        answer = (await self.answer_generator.generate(question, chunks)).strip()
        if answer == REFUSAL_MESSAGE:
            return self.refusal()

        citation_matches = list(SOURCE_MARKER.finditer(answer))
        if not citation_matches:
            return self.refusal()

        referenced_indexes = [int(match.group(1)) - 1 for match in citation_matches]
        if any(index < 0 or index >= len(chunks) for index in referenced_indexes):
            return self.refusal()

        cited_indexes = list(dict.fromkeys(referenced_indexes))
        selected_chunks = [chunks[index] for index in cited_indexes]
        sources = self._deduplicate_sources(selected_chunks)
        source_numbers = {
            (source.title, source.section, source.path): index
            for index, source in enumerate(sources, start=1)
        }
        citation_numbers = {
            chunk_index: source_numbers[self._source_key(chunks[chunk_index])]
            for chunk_index in cited_indexes
        }
        normalized_answer = SOURCE_MARKER.sub(
            lambda match: f"[{citation_numbers[int(match.group(1)) - 1]}]",
            answer,
        )

        return ChatResponse(answer=normalized_answer, grounded=True, sources=sources)

    @staticmethod
    def refusal() -> ChatResponse:
        return ChatResponse(answer=REFUSAL_MESSAGE, grounded=False, sources=[])

    @staticmethod
    def _deduplicate_sources(chunks: list[RetrievedChunk]) -> list[Source]:
        sources: dict[tuple[str, str, str], Source] = {}
        for chunk in chunks:
            key = RAGService._source_key(chunk)
            source = chunk.to_source()
            existing = sources.get(key)
            if existing is None or source.score > existing.score:
                sources[key] = source
        return list(sources.values())

    @staticmethod
    def _source_key(chunk: RetrievedChunk) -> tuple[str, str, str]:
        return (chunk.title, chunk.section, chunk.path)
