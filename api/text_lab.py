from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/mockup/text-lab")


class AnalyzeRequest(BaseModel):
    text: str


@router.get("/health")
def health():
    return {"status": "ok", "plugin": "text-lab-mockup"}


@router.post("/analyze")
def analyze_text(payload: AnalyzeRequest):
    text = payload.text or ""
    words = [word for word in text.split() if word]
    lines = text.splitlines() or ([text] if text else [])

    positive_words = {"good", "great", "excellent", "happy", "useful", "nice", "love", "success"}
    negative_words = {"bad", "broken", "sad", "error", "fail", "problem", "hard", "bug"}
    tokens = {token.strip(".,!?;:()[]{}\"'").lower() for token in words}
    score = len(tokens & positive_words) - len(tokens & negative_words)

    if score > 0:
        sentiment = "positive"
    elif score < 0:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {
        "characters": len(text),
        "words": len(words),
        "lines": len(lines),
        "sentiment": sentiment,
        "score": score,
        "preview": text[:160],
    }
