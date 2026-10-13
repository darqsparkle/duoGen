"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUp, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { askGenie, getIntent, type GenieReply, type GenieRequest, type GenieTurn } from "@/lib/genie/engine";
import { featuredIntentIds } from "@/lib/genie/knowledge";
import { cn } from "@/lib/cn";
import { GenieAvatar } from "./GenieAvatar";

type Message =
  | { id: number; from: "user"; text: string }
  | ({ id: number; from: "genie" } & GenieReply);

const MAX_LENGTH = 300;

/**
 * Genie — the site assistant. Conversation state lives only in memory and resets
 * on reload. Typed questions (with recent history) are sent to /api/genie, which
 * forwards them to Google Gemini; nothing is stored by the site.
 */
export function Genie() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const nextId = useRef(1);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // A one-time greeting bubble shortly after the first page load.
  useEffect(() => {
    const show = window.setTimeout(() => setTeaser(true), 4000);
    const hide = window.setTimeout(() => setTeaser(false), 12000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // Full-screen on phones: keep the page behind it from scrolling.
    const small = window.matchMedia("(max-width: 639px)").matches;
    const previous = document.documentElement.style.overflow;
    if (small) document.documentElement.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previous;
    };
  }, [open, close]);

  // Keep the newest message in view.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, thinking, reduce]);

  async function send(request: GenieRequest, label: string) {
    if (thinking) return;
    setShowAll(false);
    const history: GenieTurn[] = messages.map((m) =>
      m.from === "user"
        ? { role: "user", text: m.text }
        : {
            role: "assistant",
            text: m.blocks.map((b) => (typeof b === "string" ? b : b.list.map((i) => `- ${i}`).join("\n"))).join("\n\n"),
          },
    );
    setMessages((m) => [...m, { id: nextId.current++, from: "user", text: label }]);
    setThinking(true);
    try {
      const reply = await askGenie(request, history);
      setMessages((m) => [...m, { id: nextId.current++, from: "genie", ...reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: nextId.current++,
          from: "genie",
          blocks: ["Sorry, something went wrong on my side. Please try again, or reach our team directly."],
          actions: [{ label: "Contact us", href: "/contact" }],
          followUps: [],
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function askIntent(intentId: string) {
    const intent = getIntent(intentId);
    if (intent) send({ kind: "intent", intentId }, intent.question);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    send({ kind: "text", text }, text);
  }

  function reset() {
    setMessages([]);
    setDraft("");
    setShowAll(false);
    inputRef.current?.focus();
  }

  // On phones the panel covers the page, so close it when following a link.
  function onActionClick() {
    if (window.matchMedia("(max-width: 639px)").matches) setOpen(false);
  }

  const lastGenie = [...messages].reverse().find((m) => m.from === "genie");
  const suggestions =
    messages.length === 0 || showAll
      ? featuredIntentIds
      : lastGenie && lastGenie.from === "genie"
        ? lastGenie.followUps
        : [];

  return (
    <>
      {/* Launcher */}
      <div
        className={cn(
          "fixed right-4 bottom-4 z-[60] flex items-end gap-3 transition-all duration-500 sm:right-6 sm:bottom-6",
          open && "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <AnimatePresence>
          {teaser && !open && (
            <motion.button
              type="button"
              onClick={() => {
                setTeaser(false);
                setOpen(true);
              }}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              className="mb-2 hidden max-w-[220px] rounded-2xl rounded-br-md border border-line bg-white px-4 py-3 text-left text-sm text-ink shadow-[0_20px_40px_-20px_rgb(17_19_38/0.5)] sm:block"
            >
              <span className="font-semibold">Hi, I&apos;m Genie! 👋</span>
              <span className="mt-0.5 block text-muted">Ask me anything about DuoGen.</span>
            </motion.button>
          )}
        </AnimatePresence>
        <button
          ref={launcherRef}
          type="button"
          onClick={() => {
            setTeaser(false);
            setOpen(true);
          }}
          aria-label="Chat with Genie, the DuoGen assistant"
          aria-expanded={open}
          aria-controls="genie-panel"
          tabIndex={open ? -1 : 0}
          className="group relative flex size-16 items-center justify-center rounded-full border border-glow/40 bg-navy shadow-[0_16px_40px_-12px_rgb(7_9_27/0.8),0_0_30px_-6px_rgb(124_255_178/0.55)] transition-transform duration-300 hover:scale-105"
        >
          <span aria-hidden className="absolute inset-0 rounded-full border border-glow/40 motion-safe:animate-pulse-ring" />
          <GenieAvatar className="relative h-10 w-auto transition-transform duration-300 group-hover:-rotate-6" />
        </button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.section
            id="genie-panel"
            role="dialog"
            aria-label="Genie, the DuoGen assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[85] flex origin-bottom-right flex-col overflow-hidden bg-navy text-white sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(680px,calc(100dvh-3rem))] sm:w-[400px] sm:rounded-[1.75rem] sm:border sm:border-white/10 sm:shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9),0_0_60px_-20px_rgb(124_255_178/0.35)]"
          >
            {/* Header */}
            <header className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 size-48 rounded-full bg-glow/15 blur-2xl" />
              <span className="relative flex size-11 items-center justify-center rounded-full bg-midnight ring-1 ring-glow/30">
                <GenieAvatar className="h-8 w-auto" />
              </span>
              <div className="relative min-w-0 flex-1">
                <p className="font-display text-lg leading-tight font-semibold">Genie</p>
                <p className="flex items-center gap-1.5 text-xs text-white/55">
                  <span aria-hidden className="size-1.5 rounded-full bg-glow" />
                  DuoGen AI assistant
                </p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Start a new conversation"
                  className="relative inline-flex size-10 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw aria-hidden className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="Close Genie"
                className="relative inline-flex size-10 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X aria-hidden className="size-5" />
              </button>
            </header>

            {/* Conversation */}
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation with Genie"
              className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-5"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center gap-3 px-2 pt-2 pb-1 text-center">
                  <GenieAvatar variant="full" className="h-32 w-auto" />
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    Hi, I&apos;m <span className="text-glow-gradient">Genie</span>
                  </h2>
                  <p className="text-sm leading-relaxed text-white/65">
                    Ask me about our services, how we work, or how to start a project. Pick a
                    question below or type your own.
                  </p>
                </div>
              )}

              {messages.map((message) =>
                message.from === "user" ? (
                  <div key={message.id} className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-glow px-4 py-2.5 text-sm font-medium text-navy">
                      {message.text}
                    </p>
                  </div>
                ) : (
                  <div key={message.id} className="flex items-start gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-midnight ring-1 ring-white/10">
                      <GenieAvatar className="h-5 w-auto" />
                    </span>
                    <div className="flex max-w-[85%] flex-col gap-2.5">
                      <div className="flex flex-col gap-2 rounded-2xl rounded-bl-md border border-white/10 bg-midnight px-4 py-3 text-sm leading-relaxed text-white/85">
                        {message.blocks.map((block, i) =>
                          typeof block === "string" ? (
                            <p key={i}>{block}</p>
                          ) : (
                            <ul key={i} className="flex flex-col gap-1.5">
                              {block.list.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-glow" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ),
                        )}
                      </div>
                      {message.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {message.actions.map((action) => (
                            <Link
                              key={action.href}
                              href={action.href}
                              onClick={onActionClick}
                              className="group inline-flex min-h-9 items-center gap-1.5 rounded-full border border-glow/40 bg-glow/10 px-3.5 text-xs font-medium text-glow transition-colors hover:bg-glow hover:text-navy"
                            >
                              {action.label}
                              <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}

              {thinking && (
                <div className="flex items-end gap-2" aria-label="Genie is typing">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-midnight ring-1 ring-white/10">
                    <GenieAvatar className="h-5 w-auto" />
                  </span>
                  <span className="flex gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-midnight px-4 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-1.5 rounded-full bg-glow motion-safe:animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </span>
                </div>
              )}

              {!thinking && suggestions.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="px-1 text-[0.65rem] font-semibold tracking-[0.14em] text-white/40 uppercase">
                    {messages.length === 0 || showAll ? "Popular questions" : "You could also ask"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((id) => {
                      const intent = getIntent(id);
                      if (!intent) return null;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => askIntent(id)}
                          className="rounded-2xl border border-white/12 bg-white/[0.04] px-3.5 py-2 text-left text-sm text-white/85 transition-colors hover:border-glow/50 hover:bg-glow/10 hover:text-white"
                        >
                          {intent.question}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {!thinking && messages.length > 0 && !showAll && (
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="self-start px-1 text-xs font-medium text-glow underline-offset-4 hover:underline"
                >
                  Show all questions
                </button>
              )}
            </div>

            {/* Composer */}
            <form onSubmit={onSubmit} className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2 rounded-full border border-white/12 bg-midnight py-1.5 pr-1.5 pl-4 focus-within:border-glow/60">
                <label htmlFor="genie-input" className="sr-only">
                  Type your question
                </label>
                <input
                  ref={inputRef}
                  id="genie-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
                  placeholder="Ask Genie a question…"
                  autoComplete="off"
                  maxLength={MAX_LENGTH}
                  className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none focus-visible:shadow-none focus-visible:outline-none sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || thinking}
                  aria-label="Send"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-glow text-navy transition-opacity disabled:opacity-40"
                >
                  <ArrowUp aria-hidden className="size-4" />
                </button>
              </div>
              <p className="mt-2 px-2 text-center text-[0.65rem] leading-snug text-white/40">
                Typed questions are answered by AI (Google Gemini) and may be inaccurate. Please
                don&apos;t share personal details. DuoGen doesn&apos;t store chats.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
