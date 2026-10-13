import { featuredIntentIds, genieIntents, type GenieAction, type GenieBlock } from "./knowledge";

export type GenieReply = {
  blocks: GenieBlock[];
  actions: GenieAction[];
  /** Suggested next questions, as intent ids. */
  followUps: string[];
};

export type GenieRequest =
  /** A tapped ready-made question. */
  | { kind: "intent"; intentId: string }
  /** Free text typed by the visitor. */
  | { kind: "text"; text: string };

const byId = new Map(genieIntents.map((intent) => [intent.id, intent]));

export function getIntent(id: string) {
  return byId.get(id);
}

function normalize(text: string) {
  return ` ${text.toLowerCase().replace(/[^a-z0-9₹\s-]/g, " ").replace(/\s+/g, " ")} `;
}

/** Scores each intent by matched keywords; multi-word phrases count for more. */
function matchIntent(text: string) {
  const haystack = normalize(text);
  let best: { id: string; score: number } | null = null;
  for (const intent of genieIntents) {
    let score = 0;
    for (const keyword of intent.keywords) {
      if (haystack.includes(` ${keyword} `) || (keyword.length > 4 && haystack.includes(keyword))) {
        score += keyword.includes(" ") ? 2 : 1;
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { id: intent.id, score };
  }
  return best?.id;
}

const GREETING = /^\s*(hi|hii+|hello|hey|hola|namaste|good (morning|afternoon|evening))\b/i;
const THANKS = /\b(thanks|thank you|thx|great|awesome|cool)\b/i;

function replyFor(intentId: string): GenieReply {
  const intent = byId.get(intentId)!;
  return { blocks: intent.answer, actions: intent.actions, followUps: intent.followUps };
}

function localReply(request: GenieRequest): GenieReply {
  if (request.kind === "intent" && byId.has(request.intentId)) return replyFor(request.intentId);

  const text = request.kind === "text" ? request.text : "";
  const matched = matchIntent(text);
  if (matched) return replyFor(matched);

  if (GREETING.test(text)) {
    return {
      blocks: ["Hello! 👋 I can tell you about our services, how we work, and how to start a project. What would you like to know?"],
      actions: [],
      followUps: ["services", "process", "getting-started"],
    };
  }
  if (THANKS.test(text)) {
    return {
      blocks: ["You're welcome! Is there anything else I can help you with?"],
      actions: [{ label: "Start a project", href: "/contact" }],
      followUps: ["services", "cost"],
    };
  }
  return {
    blocks: [
      "I'm still learning, so I don't have an answer for that yet. Our team can help directly — or try one of these questions.",
    ],
    actions: [{ label: "Ask our team", href: "/contact" }],
    followUps: featuredIntentIds.slice(0, 3),
  };
}

/** Turns plain-text AI output into paragraphs and "- " bullet lists. */
function toBlocks(text: string): GenieBlock[] {
  const blocks: GenieBlock[] = [];
  for (const chunk of text.split(/\n{2,}/)) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    let list: string[] = [];
    let para: string[] = [];
    const flushPara = () => {
      if (para.length) blocks.push(para.join(" "));
      para = [];
    };
    const flushList = () => {
      if (list.length) blocks.push({ list });
      list = [];
    };
    for (const line of lines) {
      const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
      if (bullet) {
        flushPara();
        list.push(bullet[1].replace(/\*\*/g, ""));
      } else {
        flushList();
        para.push(line.replace(/\*\*/g, ""));
      }
    }
    flushPara();
    flushList();
  }
  return blocks;
}

export type GenieTurn = { role: "user" | "assistant"; text: string };

/** Asks the AI endpoint. Throws when it is unavailable so the caller can fall back. */
async function aiReply(text: string, history: GenieTurn[]): Promise<GenieReply> {
  const response = await fetch("/api/genie", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [...history, { role: "user", text }] }),
  });
  if (!response.ok) throw new Error(`genie api ${response.status}`);
  const data: { reply: string; topic: string } = await response.json();
  const intent = byId.get(data.topic);
  return {
    blocks: toBlocks(data.reply),
    actions: intent?.actions ?? [],
    followUps: intent?.followUps ?? [],
  };
}

/**
 * The single entry point for Genie's answers — the UI only talks to this.
 *
 * Tapped ready-made questions use the curated local answers (instant, and they
 * don't spend AI quota). Typed questions go to the AI endpoint (/api/genie,
 * Google Gemini); if it's unavailable or over quota, Genie falls back to local
 * keyword matching so the chat never breaks.
 */
export async function askGenie(request: GenieRequest, history: GenieTurn[] = []): Promise<GenieReply> {
  if (request.kind === "text") {
    try {
      return await aiReply(request.text, history);
    } catch {
      // Fall through to the local answers.
    }
  }
  // Short pause so local replies feel conversational rather than instant.
  await new Promise((resolve) => setTimeout(resolve, 500));
  return localReply(request);
}
