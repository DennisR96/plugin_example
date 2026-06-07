import { NextRequest, NextResponse } from "next/server";

const positiveWords = new Set(["good", "great", "excellent", "happy", "useful", "nice", "love", "success"]);
const negativeWords = new Set(["bad", "broken", "sad", "error", "fail", "problem", "hard", "bug"]);

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));
  const text = typeof payload.text === "string" ? payload.text : "";

  const words = text.split(/\s+/).filter(Boolean);
  const lines = text.length > 0 ? text.split(/\r?\n/) : [];
  const tokens = new Set(words.map((token) => token.replace(/^[.,!?;:()\[\]{}"']+|[.,!?;:()\[\]{}"']+$/g, "").toLowerCase()));

  let score = 0;
  for (const token of tokens) {
    if (positiveWords.has(token)) score += 1;
    if (negativeWords.has(token)) score -= 1;
  }

  const sentiment = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";

  return NextResponse.json({
    characters: text.length,
    words: words.length,
    lines: lines.length,
    sentiment,
    score,
    preview: text.slice(0, 160),
  });
}
