import { NextResponse } from "next/server";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

type BlogCandidate = {
  id: string;
  title: string;
  slug: string;
  category?: string;
  status: string;
  createdAt: string;
};

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = String(body?.query ?? "").trim();
    const candidates: BlogCandidate[] = Array.isArray(body?.candidates) ? body.candidates : [];

    if (!query || candidates.length === 0) {
      return NextResponse.json({ rankedIds: [], mode: "fallback" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        rankedIds: candidates.map((item) => item.id),
        mode: "fallback-no-key",
      });
    }

    const modelName = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    const { text } = await generateText({
      model: groq(modelName),
      temperature: 0,
      system:
        "You are a search reranker. Return only valid JSON in this exact shape: {\"rankedIds\":[\"id1\",\"id2\"]}. Rank by semantic relevance to the user's query. Do not include markdown, explanation, or extra keys.",
      prompt: JSON.stringify({
        query,
        candidates,
      }),
    });

    const parsed = safeJsonParse<{ rankedIds?: string[] }>(text);
    const rankedIds =
      parsed?.rankedIds?.filter((id) => candidates.some((c) => c.id === id)) ??
      candidates.map((c) => c.id);

    return NextResponse.json({ rankedIds, mode: "groq" });
  } catch {
    return NextResponse.json(
      { rankedIds: [], mode: "error" },
      { status: 500 }
    );
  }
}