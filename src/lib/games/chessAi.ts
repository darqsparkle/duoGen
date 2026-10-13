import type { Chess, Move, PieceSymbol } from "chess.js";

/**
 * A small, readable chess opponent: material + simple positional bonuses,
 * searched with minimax and alpha-beta pruning. Strong enough to be fun,
 * light enough to run instantly in the browser.
 */

const VALUES: Record<PieceSymbol, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

// Distance from the board centre (0 = centre squares, 3 = edge).
const centreDistance = (file: number, rank: number) =>
  Math.max(Math.abs(3.5 - file), Math.abs(3.5 - rank)) - 0.5;

/** Positional bonus for a piece at (file, rank), from that piece's own side. */
function positional(type: PieceSymbol, file: number, rank: number, white: boolean) {
  const advance = white ? rank : 7 - rank; // 0 = home rank
  const centre = 3 - centreDistance(file, rank);
  switch (type) {
    case "p":
      return advance * 8 + (file >= 2 && file <= 5 ? centre * 4 : 0);
    case "n":
      return centre * 12 - (advance === 0 ? 10 : 0);
    case "b":
      return centre * 6 - (advance === 0 ? 8 : 0);
    case "r":
      return advance === 6 ? 15 : 0; // rook on the 7th
    case "q":
      return centre * 3;
    case "k":
      return advance === 0 ? 10 : -10; // stay home in the middlegame
  }
}

/** Static evaluation in centipawns; positive favours white. */
export function evaluate(game: Chess) {
  if (game.isCheckmate()) return game.turn() === "w" ? -100000 : 100000;
  if (game.isDraw()) return 0;
  let score = 0;
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;
      const white = piece.color === "w";
      // board()[0] is rank 8, so convert to a 0-based rank from white's side.
      const rank = 7 - r;
      const value = VALUES[piece.type] + positional(piece.type, f, rank, white);
      score += white ? value : -value;
    }
  }
  return score;
}

/** Captures and promotions first: better pruning, faster search. */
function ordered(moves: Move[]) {
  return moves.sort((a, b) => {
    const score = (m: Move) =>
      (m.captured ? VALUES[m.captured] * 10 - VALUES[m.piece] : 0) + (m.promotion ? 800 : 0);
    return score(b) - score(a);
  });
}

function minimax(game: Chess, depth: number, alpha: number, beta: number): number {
  if (depth === 0 || game.isGameOver()) return evaluate(game);
  const maximizing = game.turn() === "w";
  let best = maximizing ? -Infinity : Infinity;
  for (const move of ordered(game.moves({ verbose: true }))) {
    game.move(move);
    const value = minimax(game, depth - 1, alpha, beta);
    game.undo();
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, value);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, value);
    }
    if (beta <= alpha) break;
  }
  return best;
}

export type Difficulty = "easy" | "normal";

// Depth 3+ takes seconds on phones and would freeze the page, so stop at 2.
const DEPTH: Record<Difficulty, number> = { easy: 1, normal: 2 };
// Easy also plays a slightly random move among near-equal options.
const SLACK: Record<Difficulty, number> = { easy: 120, normal: 15 };

/** Picks a move for the side to move. Mutates nothing permanently. */
export function chooseMove(game: Chess, difficulty: Difficulty): Move | null {
  const moves = ordered(game.moves({ verbose: true }));
  if (!moves.length) return null;
  const side = game.turn() === "w" ? 1 : -1;
  const scored = moves.map((move) => {
    game.move(move);
    const score = side * minimax(game, DEPTH[difficulty] - 1, -Infinity, Infinity);
    game.undo();
    return { move, score };
  });
  const best = Math.max(...scored.map((s) => s.score));
  const candidates = scored.filter((s) => s.score >= best - SLACK[difficulty]);
  return candidates[Math.floor(Math.random() * candidates.length)].move;
}
