from __future__ import annotations

import re
import uuid
from dataclasses import dataclass
from pathlib import Path

import yaml


NUMBER_PREFIX = re.compile(r"^\d+[-_]?")
HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*$")


@dataclass(frozen=True)
class BookDocument:
    title: str
    path: str
    source_file: str
    module: str
    body: str


@dataclass(frozen=True)
class BookChunk:
    id: str
    title: str
    section: str
    path: str
    source_file: str
    module: str
    chunk_index: int
    text: str


def discover_book_files(docs_root: Path) -> list[Path]:
    files = [*docs_root.rglob("*.md"), *docs_root.rglob("*.mdx")]
    ignored_parts = {"node_modules", "build", ".docusaurus", ".git"}
    return sorted(path for path in files if not ignored_parts.intersection(path.parts))


def load_document(file_path: Path, docs_root: Path) -> BookDocument:
    raw = file_path.read_text(encoding="utf-8")
    metadata, body = _parse_front_matter(raw)
    title = str(metadata.get("title") or _first_heading(body) or file_path.stem)
    relative = file_path.relative_to(docs_root)
    source_file = f"docs/{relative.as_posix()}"
    module = _clean_segment(relative.parts[0]) if len(relative.parts) > 1 else "course"
    page_path = _docusaurus_path(relative, metadata)
    return BookDocument(
        title=title,
        path=page_path,
        source_file=source_file,
        module=module,
        body=_remove_mdx_scaffolding(body).strip(),
    )


def chunk_document(
    document: BookDocument,
    *,
    chunk_size: int,
    overlap: int,
) -> list[BookChunk]:
    sections = _split_sections(document.body, document.title)
    raw_chunks: list[tuple[str, str]] = []

    for section, content in sections:
        blocks = _split_blocks(content)
        if not blocks:
            continue
        current: list[str] = []
        current_words = 0

        for block in blocks:
            block_words = len(block.split())
            if current and current_words + block_words > chunk_size:
                raw_chunks.append((section, "\n\n".join(current).strip()))
                current = _overlap_blocks(current, overlap)
                current_words = sum(len(item.split()) for item in current)

            if block_words > chunk_size and not current:
                pieces = _split_large_block(block, chunk_size, overlap)
                raw_chunks.extend((section, piece) for piece in pieces[:-1])
                current = [pieces[-1]]
                current_words = len(pieces[-1].split())
            else:
                current.append(block)
                current_words += block_words

        if current:
            raw_chunks.append((section, "\n\n".join(current).strip()))

    chunks: list[BookChunk] = []
    for index, (section, text) in enumerate(raw_chunks):
        chunk_text = f"Chapter: {document.title}\nSection: {section}\n\n{text}".strip()
        stable_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{document.source_file}:{index}"))
        chunks.append(
            BookChunk(
                id=stable_id,
                title=document.title,
                section=section,
                path=document.path,
                source_file=document.source_file,
                module=document.module,
                chunk_index=index,
                text=chunk_text,
            )
        )
    return chunks


def _parse_front_matter(raw: str) -> tuple[dict, str]:
    if not raw.startswith("---"):
        return {}, raw
    lines = raw.splitlines()
    try:
        closing = lines.index("---", 1)
    except ValueError:
        return {}, raw
    metadata = yaml.safe_load("\n".join(lines[1:closing])) or {}
    if not isinstance(metadata, dict):
        metadata = {}
    return metadata, "\n".join(lines[closing + 1 :])


def _first_heading(body: str) -> str | None:
    for line in body.splitlines():
        match = HEADING.match(line)
        if match and len(match.group(1)) == 1:
            return _clean_heading(match.group(2))
    return None


def _remove_mdx_scaffolding(body: str) -> str:
    cleaned: list[str] = []
    for line in body.splitlines():
        stripped = line.strip()
        if stripped.startswith(("import ", "export ")):
            continue
        cleaned.append(line)
    return "\n".join(cleaned)


def _split_sections(body: str, fallback_title: str) -> list[tuple[str, str]]:
    sections: list[tuple[str, str]] = []
    current_heading = "Overview"
    current_lines: list[str] = []
    in_fence = False

    def flush() -> None:
        content = "\n".join(current_lines).strip()
        if content:
            sections.append((current_heading, content))

    for line in body.splitlines():
        if line.strip().startswith("```") or line.strip().startswith("~~~"):
            in_fence = not in_fence
        match = HEADING.match(line) if not in_fence else None
        if match:
            level = len(match.group(1))
            heading = _clean_heading(match.group(2))
            if level == 1:
                if heading != fallback_title:
                    current_lines.append(line)
                continue
            flush()
            current_heading = heading
            current_lines = []
            continue
        current_lines.append(line)
    flush()
    return sections


def _split_blocks(content: str) -> list[str]:
    blocks: list[str] = []
    current: list[str] = []
    in_fence = False
    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_fence = not in_fence
        if not stripped and not in_fence:
            if current:
                blocks.append("\n".join(current).strip())
                current = []
            continue
        current.append(line)
    if current:
        blocks.append("\n".join(current).strip())
    return [block for block in blocks if block]


def _overlap_blocks(blocks: list[str], target_words: int) -> list[str]:
    if target_words <= 0:
        return []
    selected: list[str] = []
    count = 0
    for block in reversed(blocks):
        selected.insert(0, block)
        count += len(block.split())
        if count >= target_words:
            break
    return selected


def _split_large_block(block: str, size: int, overlap: int) -> list[str]:
    words = block.split()
    if len(words) <= size:
        return [block]
    step = max(1, size - overlap)
    return [" ".join(words[start : start + size]) for start in range(0, len(words), step)]


def _docusaurus_path(relative: Path, metadata: dict) -> str:
    explicit_slug = metadata.get("slug")
    if explicit_slug == "/":
        return "/docs/"
    if isinstance(explicit_slug, str) and explicit_slug.strip():
        return f"/docs/{explicit_slug.strip('/')}"

    parts = [_clean_segment(part) for part in relative.with_suffix("").parts]
    if parts[-1] in {"index", "readme"}:
        parts = parts[:-1]
    return "/docs/" + "/".join(parts)


def _clean_segment(value: str) -> str:
    return NUMBER_PREFIX.sub("", value).strip("-_").lower()


def _clean_heading(value: str) -> str:
    return re.sub(r"[`*_]", "", value).strip()

