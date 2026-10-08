from __future__ import annotations

import asyncio

from google import genai
from google.genai import types
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from app.config import Settings
from app.prompts.rag_prompt import build_rag_prompt
from app.schemas import RetrievedChunk


class AnswerGenerationError(RuntimeError):
    """Raised when Gemini cannot produce a usable grounded answer."""


class GeminiAnswerService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._client: genai.Client | None = None

    @property
    def client(self) -> genai.Client:
        if self._client is None:
            self._client = genai.Client(api_key=self.settings.require_google_api_key())
        return self._client

    async def generate(self, question: str, chunks: list[RetrievedChunk]) -> str:
        prompt = build_rag_prompt(question, chunks)
        return await asyncio.to_thread(self._generate_sync, prompt)

    @retry(
        retry=retry_if_exception_type(Exception),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=8),
        reraise=True,
    )
    def _generate_sync(self, prompt: str) -> str:
        try:
            response = self.client.models.generate_content(
                model=self.settings.gemini_generation_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=1200,
                    thinking_config=types.ThinkingConfig(thinking_budget=0),
                ),
            )
        except Exception as exc:
            raise AnswerGenerationError("Gemini answer generation failed") from exc

        answer = (response.text or "").strip()
        if not answer:
            raise AnswerGenerationError("Gemini returned an empty answer")
        return answer
