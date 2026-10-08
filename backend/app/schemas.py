from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, field_validator


REFUSAL_MESSAGE = (
    "I can only answer questions using the content available in this AI/ML book. "
    "I could not find enough relevant information in the book to answer your question."
)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)

    @field_validator("question")
    @classmethod
    def normalize_question(cls, value: str) -> str:
        normalized = " ".join(value.split())
        if not normalized:
            raise ValueError("Question must not be empty")
        return normalized


class Source(BaseModel):
    title: str
    section: str
    path: str
    score: float = Field(ge=0.0)


class ChatResponse(BaseModel):
    answer: str
    grounded: bool
    sources: list[Source] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class RetrievedChunk(BaseModel):
    model_config = ConfigDict(frozen=True)

    text: str
    title: str
    section: str
    path: str
    source_file: str
    chunk_index: int
    score: float

    def to_source(self) -> Source:
        return Source(
            title=self.title,
            section=self.section,
            path=self.path,
            score=round(self.score, 4),
        )

