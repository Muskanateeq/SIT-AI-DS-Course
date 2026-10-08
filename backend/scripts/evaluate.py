from __future__ import annotations

import argparse
import json
from pathlib import Path

import httpx


BACKEND_ROOT = Path(__file__).resolve().parents[1]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate the running book RAG API")
    parser.add_argument("--api-url", default="http://localhost:8000")
    parser.add_argument(
        "--questions",
        type=Path,
        default=BACKEND_ROOT / "evaluation" / "questions.json",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    cases = json.loads(args.questions.read_text(encoding="utf-8"))
    correct = 0
    with httpx.Client(base_url=args.api_url, timeout=60) as client:
        for case in cases:
            response = client.post("/api/chat", json={"question": case["question"]})
            response.raise_for_status()
            payload = response.json()
            actual = "answer" if payload["grounded"] else "refuse"
            passed = actual == case["expected"]
            correct += int(passed)
            mark = "PASS" if passed else "FAIL"
            print(f"{mark} | expected={case['expected']} actual={actual} | {case['question']}")

    total = len(cases)
    print(f"\nAccuracy: {correct}/{total} ({correct / total:.1%})")


if __name__ == "__main__":
    main()

