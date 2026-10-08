from __future__ import annotations

from collections.abc import Sequence

from qdrant_client import AsyncQdrantClient, models

from app.config import Settings


class CollectionConfigurationError(RuntimeError):
    """Raised when an existing Qdrant collection is incompatible."""


class QdrantService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.client = AsyncQdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key_value,
            timeout=30,
        )

    async def ensure_collection(self, *, recreate: bool = False) -> None:
        collection = self.settings.qdrant_collection
        exists = await self.client.collection_exists(collection)

        if exists and recreate:
            await self.client.delete_collection(collection)
            exists = False

        if not exists:
            await self.client.create_collection(
                collection_name=collection,
                vectors_config=models.VectorParams(
                    size=self.settings.gemini_embedding_dimension,
                    distance=models.Distance.COSINE,
                ),
            )
            await self._ensure_payload_indexes()
            return

        info = await self.client.get_collection(collection)
        vector_config = info.config.params.vectors
        existing_size = getattr(vector_config, "size", None)
        existing_distance = getattr(vector_config, "distance", None)
        if existing_size != self.settings.gemini_embedding_dimension:
            raise CollectionConfigurationError(
                f"Qdrant collection '{collection}' uses {existing_size} dimensions, "
                f"but settings require {self.settings.gemini_embedding_dimension}. "
                "Re-index with --recreate after confirming the target collection."
            )
        if existing_distance != models.Distance.COSINE:
            raise CollectionConfigurationError(
                f"Qdrant collection '{collection}' must use cosine distance"
            )
        await self._ensure_payload_indexes(info)

    async def _ensure_payload_indexes(self, collection_info=None) -> None:
        """Create indexes needed by update filters, including Qdrant strict mode."""
        payload_schema = getattr(collection_info, "payload_schema", {}) or {}
        if "source_file" in payload_schema:
            return
        await self.client.create_payload_index(
            collection_name=self.settings.qdrant_collection,
            field_name="source_file",
            field_schema=models.PayloadSchemaType.KEYWORD,
            wait=True,
        )

    async def upsert(self, points: Sequence[models.PointStruct]) -> None:
        if not points:
            return
        await self.client.upsert(
            collection_name=self.settings.qdrant_collection,
            points=list(points),
            wait=True,
        )

    async def delete_source(self, source_file: str) -> None:
        await self.client.delete(
            collection_name=self.settings.qdrant_collection,
            points_selector=models.FilterSelector(
                filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="source_file",
                            match=models.MatchValue(value=source_file),
                        )
                    ]
                )
            ),
            wait=True,
        )

    async def query(self, vector: list[float], *, limit: int) -> list[models.ScoredPoint]:
        response = await self.client.query_points(
            collection_name=self.settings.qdrant_collection,
            query=vector,
            limit=limit,
            with_payload=True,
            with_vectors=False,
        )
        return list(response.points)

    async def close(self) -> None:
        await self.client.close()
