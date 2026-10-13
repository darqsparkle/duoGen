import { buildSystemPrompt, genieTopics } from "@/lib/genie/prompt";

/**
 * Genie's AI endpoint. Proxies typed questions to Google Gemini so the API key
 * stays on the server. Configure with GEMINI_API_KEY (and optionally
 * GEMINI_MODELS) in .env.local. Nothing is stored here.
 */

// Models are tried in order: if one is busy (503), retired (404), or slow, the
// next one answers. "-latest" aliases follow Google's current models, so a
// retirement never leaves Genie without a working model. Override with
// GEMINI_MODELS (comma-separated) without touching code.
const MODELS = (process.env.GEMINI_MODELS || "gemini-3.5-flash,gemini-flash-latest,gemini-3.1-flash-lite")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);
const endpoint = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const MAX_TURNS = 10;
const MAX_CHARS = 600;

// Simple per-visitor limit so one visitor can't drain the free-tier quota.
// In-memory, so it is per server instance — fine for a single deployment.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

type Turn = { role: "user" | "assistant"; text: string };

function parseTurns(body: unknown): Turn[] | null {
  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray((body as { messages?: unknown }).messages)
  )
    return null;
  const turns = (body as { messages: unknown[] }).messages
    .filter(
      (m): m is Turn =>
        !!m &&
        typeof m === "object" &&
        ((m as Turn).role === "user" || (m as Turn).role === "assistant") &&
        typeof (m as Turn).text === "string",
    )
    .map((m) => ({ role: m.role, text: m.text.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);
  // Gemini expects the conversation to start with the user and end with the user.
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return turns;
}

const json = (data: unknown, status = 200) => Response.json(data, { status });

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return json({ error: "not_configured" }, 503);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  const turns = parseTurns(await request.json().catch(() => null));
  if (!turns) return json({ error: "bad_request" }, 400);

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
    contents: turns.map((t) => ({
      role: t.role === "user" ? "user" : "model",
      parts: [{ text: t.text }],
    })),
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          reply: { type: "STRING" },
          topic: { type: "STRING", enum: genieTopics },
        },
        required: ["reply", "topic"],
      },
    },
  });

  try {
    let response: Response | undefined;
    for (const model of MODELS) {
      try {
        response = await fetch(endpoint(model), {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
          body: payload,
          signal: AbortSignal.timeout(10000),
        });
      } catch (error) {
        console.warn(`[genie] ${model} timed out or failed, trying fallback`, error);
        response = undefined;
        continue;
      }
      if (response.status !== 503 && response.status !== 404) break;
      console.warn(`[genie] ${model} unavailable (${response.status}), trying fallback`);
    }
    if (!response) return json({ error: "upstream" }, 502);

    if (!response.ok) {
      console.error("[genie] Gemini error", response.status, (await response.text()).slice(0, 300));
      return json({ error: response.status === 429 ? "quota" : "upstream" }, 502);
    }

    const data = await response.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("");
    const parsed = text ? JSON.parse(text) : null;
    if (!parsed || typeof parsed.reply !== "string" || !parsed.reply.trim()) {
      return json({ error: "empty" }, 502);
    }
    return json({
      reply: parsed.reply.trim(),
      topic: genieTopics.includes(parsed.topic) ? parsed.topic : "none",
    });
  } catch (error) {
    console.error("[genie] request failed", error);
    return json({ error: "upstream" }, 502);
  }
}
