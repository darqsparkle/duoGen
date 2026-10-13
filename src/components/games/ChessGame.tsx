"use client";

import { Chess, type Square } from "chess.js";
import { RotateCcw, Undo2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { chooseMove, type Difficulty } from "@/lib/games/chessAi";
import { cn } from "@/lib/cn";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
// Solid glyphs for both sides (coloured with CSS); ︎ forces text, not emoji.
const GLYPH: Record<string, string> = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
const NAME: Record<string, string> = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" };

function statusText(game: Chess, thinking: boolean) {
  if (game.isCheckmate()) return game.turn() === "w" ? "Checkmate — Genie wins this one." : "Checkmate — you win! 🎉";
  if (game.isStalemate()) return "Stalemate — it's a draw.";
  if (game.isDraw()) return "Draw.";
  if (thinking) return "Genie is thinking…";
  return game.inCheck() ? "Check! Your move." : "Your move (white).";
}

/** Play white against Genie. Tap a piece, then tap a highlighted square. */
export function ChessGame() {
  // The move list is the source of truth; the position is rebuilt from it, which
  // keeps undo simple and draw-by-repetition detection intact.
  const [moves, setMoves] = useState<string[]>([]);
  const [selected, setSelected] = useState<Square | null>(null);
  const [thinking, setThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  const game = useMemo(() => {
    const g = new Chess();
    for (const move of moves) g.move(move);
    return g;
  }, [moves]);

  const board = useMemo(() => game.board(), [game]);
  const history = useMemo(() => game.history({ verbose: true }), [game]);
  const lastMove = history.at(-1);

  const targets = useMemo(() => {
    if (!selected) return new Set<string>();
    return new Set(game.moves({ square: selected, verbose: true }).map((m) => m.to));
  }, [game, selected]);

  // Genie replies as black.
  useEffect(() => {
    if (game.turn() !== "b" || game.isGameOver()) return;
    const think = window.setTimeout(() => setThinking(true), 0);
    const timer = window.setTimeout(() => {
      const move = chooseMove(new Chess(game.fen()), difficulty);
      if (move) setMoves((m) => [...m, move.lan]);
      setThinking(false);
    }, 350);
    return () => {
      window.clearTimeout(think);
      window.clearTimeout(timer);
    };
  }, [game, difficulty]);

  function onSquare(square: Square) {
    if (thinking || game.isGameOver() || game.turn() !== "w") return;
    if (selected && targets.has(square)) {
      const move = new Chess(game.fen()).move({ from: selected, to: square, promotion: "q" });
      setMoves((m) => [...m, move.lan]);
      setSelected(null);
      return;
    }
    const piece = game.get(square);
    setSelected(piece?.color === "w" && selected !== square ? square : null);
  }

  function newGame() {
    setMoves([]);
    setSelected(null);
    setThinking(false);
  }

  function undo() {
    if (thinking) return;
    // Take back Genie's reply and your move.
    setMoves((m) => m.slice(0, game.turn() === "w" ? -2 : -1));
    setSelected(null);
  }

  const checkedKing =
    game.inCheck() &&
    board.flat().find((p) => p && p.type === "k" && p.color === game.turn())?.square;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm font-medium text-white/85">
          {statusText(game, thinking)}
        </p>
        <div className="flex items-center gap-1 rounded-full border border-white/10 p-1 text-xs" role="group" aria-label="Difficulty">
          {(["easy", "normal"] as const).map((level) => (
            <button
              key={level}
              type="button"
              aria-pressed={difficulty === level}
              onClick={() => setDifficulty(level)}
              className={cn(
                "rounded-full px-3 py-1 capitalize transition-colors",
                difficulty === level ? "bg-glow text-navy" : "text-white/60 hover:text-white",
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div
        role="grid"
        aria-label="Chess board"
        className="mx-auto grid aspect-square w-full max-w-[min(440px,58dvh)] grid-cols-8 grid-rows-8 overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]"
      >
        {board.map((row, r) =>
          row.map((piece, f) => {
            const square = `${FILES[f]}${8 - r}` as Square;
            const light = (r + f) % 2 === 0;
            const isTarget = targets.has(square);
            const label = `${square}${piece ? `, ${piece.color === "w" ? "white" : "black"} ${NAME[piece.type]}` : ""}${isTarget ? ", move here" : ""}`;
            return (
              <button
                key={square}
                type="button"
                role="gridcell"
                aria-label={label}
                aria-selected={selected === square}
                onClick={() => onSquare(square)}
                className={cn(
                  "relative flex items-center justify-center focus-visible:z-10",
                  // One background per square: check > last move > normal.
                  checkedKing === square
                    ? "bg-[#ff8a8a]"
                    : lastMove?.from === square || lastMove?.to === square
                      ? light
                        ? "bg-mint"
                        : "bg-[#6fd6a0]"
                      : light
                        ? "bg-lavender"
                        : "bg-[#8f98da]",
                  selected === square && "shadow-[inset_0_0_0_3px_#7CFFB2]",
                )}
              >
                {piece && (
                  <span
                    aria-hidden
                    className={cn(
                      "text-[min(9vw,2.4rem)] leading-none select-none sm:text-[2.6rem]",
                      piece.color === "w"
                        ? "text-white [text-shadow:0_0_1px_#111326,0_0_1px_#111326,0_1px_2px_rgb(17_19_38/0.6)]"
                        : "text-ink [text-shadow:0_1px_1px_rgb(255_255_255/0.3)]",
                    )}
                  >
                    {GLYPH[piece.type]}
                    {"︎"}
                  </span>
                )}
                {isTarget && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute rounded-full",
                      piece ? "inset-1 border-[3px] border-ink/35" : "size-[28%] bg-ink/30",
                    )}
                  />
                )}
                {f === 0 && (
                  <span aria-hidden className="absolute top-0.5 left-1 text-[0.55rem] font-semibold text-ink/50">
                    {8 - r}
                  </span>
                )}
                {r === 7 && (
                  <span aria-hidden className="absolute right-1 bottom-0.5 text-[0.55rem] font-semibold text-ink/50">
                    {FILES[f]}
                  </span>
                )}
              </button>
            );
          }),
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={thinking || moves.length === 0}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/15 px-4 text-sm text-white/80 hover:border-glow/50 hover:text-white disabled:opacity-40"
        >
          <Undo2 aria-hidden className="size-4" /> Undo
        </button>
        <button
          type="button"
          onClick={newGame}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-glow px-4 text-sm font-medium text-navy hover:bg-fresh"
        >
          <RotateCcw aria-hidden className="size-4" /> New game
        </button>
      </div>
    </div>
  );
}
