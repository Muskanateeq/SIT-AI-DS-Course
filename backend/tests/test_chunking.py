from pathlib import Path

from app.ingestion.markdown import chunk_document, load_document


def test_markdown_metadata_and_headings_are_preserved(tmp_path: Path) -> None:
    docs = tmp_path / "docs"
    chapter_dir = docs / "04-machine-learning"
    chapter_dir.mkdir(parents=True)
    chapter = chapter_dir / "01-overfitting.md"
    chapter.write_text(
        """---
title: Overfitting
---

# Overfitting

An overview of model generalization.

## Warning signs

Training performance improves while validation performance becomes worse.
""",
        encoding="utf-8",
    )

    document = load_document(chapter, docs)
    chunks = chunk_document(document, chunk_size=100, overlap=10)

    assert document.path == "/docs/machine-learning/overfitting"
    assert document.source_file == "docs/04-machine-learning/01-overfitting.md"
    assert [chunk.section for chunk in chunks] == ["Overview", "Warning signs"]
    assert all(chunk.title == "Overfitting" for chunk in chunks)


def test_chunk_ids_are_stable(tmp_path: Path) -> None:
    docs = tmp_path / "docs"
    docs.mkdir()
    chapter = docs / "intro.md"
    chapter.write_text("---\ntitle: Intro\nslug: /\n---\n\n# Intro\n\nWelcome.", encoding="utf-8")

    document = load_document(chapter, docs)
    first = chunk_document(document, chunk_size=100, overlap=10)
    second = chunk_document(document, chunk_size=100, overlap=10)

    assert document.path == "/docs/"
    assert [chunk.id for chunk in first] == [chunk.id for chunk in second]

