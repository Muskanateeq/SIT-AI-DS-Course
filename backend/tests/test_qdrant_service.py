from types import SimpleNamespace

import pytest
from qdrant_client import models

from app.config import Settings
from app.services.qdrant_service import QdrantService


class FakeQdrantClient:
    def __init__(self, *, exists: bool, payload_schema: dict | None = None) -> None:
        self.exists = exists
        self.payload_schema = payload_schema or {}
        self.created_collection = False
        self.created_indexes: list[tuple[str, models.PayloadSchemaType]] = []

    async def collection_exists(self, _collection: str) -> bool:
        return self.exists

    async def create_collection(self, **_kwargs) -> None:
        self.created_collection = True

    async def get_collection(self, _collection: str):
        return SimpleNamespace(
            config=SimpleNamespace(
                params=SimpleNamespace(
                    vectors=SimpleNamespace(size=768, distance=models.Distance.COSINE)
                )
            ),
            payload_schema=self.payload_schema,
        )

    async def create_payload_index(self, *, field_name, field_schema, **_kwargs) -> None:
        self.created_indexes.append((field_name, field_schema))


@pytest.mark.asyncio
async def test_new_collection_gets_source_file_keyword_index() -> None:
    service = QdrantService(Settings())
    fake_client = FakeQdrantClient(exists=False)
    service.client = fake_client

    await service.ensure_collection()

    assert fake_client.created_collection is True
    assert fake_client.created_indexes == [
        ("source_file", models.PayloadSchemaType.KEYWORD)
    ]


@pytest.mark.asyncio
async def test_existing_payload_index_is_not_recreated() -> None:
    service = QdrantService(Settings())
    fake_client = FakeQdrantClient(
        exists=True,
        payload_schema={"source_file": {"data_type": "keyword"}},
    )
    service.client = fake_client

    await service.ensure_collection()

    assert fake_client.created_indexes == []
