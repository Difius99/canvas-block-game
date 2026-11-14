import { PIECE_COLORS, TRAY_SIZE } from "../config";
import type { Cell } from "../types";

export type Piece = {
  cells: Cell[];
  rows: number;
  cols: number;
  color: string;
};

// "#" — занятая клетка, "." — пустая; повороты генерируются автоматически
const SHAPE_PATTERNS: string[][] = [
  ["#"],
  ["##"],
  ["###"],
  ["####"],
  ["#####"],
  ["##", "##"],
  ["###", "###", "###"],
  ["##", "##", "##"],
  ["#.", "##"],
  ["#..", "#..", "###"],
  ["#.", "#.", "##"],
  [".#", ".#", "##"],
  ["###", ".#."],
  ["##.", ".##"],
  [".##", "##."],
];

function parsePattern(pattern: string[]): Cell[] {
  const cells: Cell[] = [];
  pattern.forEach((line, row) => {
    [...line].forEach((char, col) => {
      if (char === "#") cells.push({ row, col });
    });
  });
  return cells;
}

function normalize(cells: Cell[]): Cell[] {
  const minRow = Math.min(...cells.map((c) => c.row));
  const minCol = Math.min(...cells.map((c) => c.col));
  return cells
    .map(({ row, col }) => ({ row: row - minRow, col: col - minCol }))
    .sort((a, b) => a.row - b.row || a.col - b.col);
}

function rotate(cells: Cell[]): Cell[] {
  const maxRow = Math.max(...cells.map((c) => c.row));
  return normalize(
    cells.map(({ row, col }) => ({ row: col, col: maxRow - row })),
  );
}

function rotations(cells: Cell[]): Cell[][] {
  const result: Cell[][] = [];
  const seen = new Set<string>();
  let current = normalize(cells);

  for (let i = 0; i < 4; i++) {
    const key = current.map((c) => `${c.row},${c.col}`).join(";");
    if (!seen.has(key)) {
      seen.add(key);
      result.push(current);
    }
    current = rotate(current);
  }
  return result;
}

const SHAPES: Cell[][][] = SHAPE_PATTERNS.map((pattern) =>
  rotations(parsePattern(pattern)),
);

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createPiece(cells: Cell[], color: string): Piece {
  return {
    cells,
    rows: Math.max(...cells.map((c) => c.row)) + 1,
    cols: Math.max(...cells.map((c) => c.col)) + 1,
    color,
  };
}

export function randomPiece(): Piece {
  return createPiece(pick(pick(SHAPES)), pick(PIECE_COLORS));
}

export function createTray(): Piece[] {
  return Array.from({ length: TRAY_SIZE }, () => randomPiece());
}
