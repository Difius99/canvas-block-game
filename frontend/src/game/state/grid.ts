import { GRID_SIZE } from "../config";
import type { Cell } from "../types";
import type { Piece } from "./pieces";

// в клетке хранится цвет блока или null, если клетка пустая
export type Grid = (string | null)[][];

export type ColoredCell = Cell & { color: string };

export type Lines = { rows: number[]; cols: number[] };

export function createGrid(size = GRID_SIZE): Grid {
  return Array.from({ length: size }, () =>
    Array<string | null>(size).fill(null),
  );
}

export function canPlace(grid: Grid, piece: Piece, at: Cell): boolean {
  const size = grid.length;
  return piece.cells.every(({ row, col }) => {
    const r = at.row + row;
    const c = at.col + col;
    return r >= 0 && r < size && c >= 0 && c < size && grid[r][c] === null;
  });
}

export function placePiece(grid: Grid, piece: Piece, at: Cell): void {
  for (const { row, col } of piece.cells) {
    grid[at.row + row][at.col + col] = piece.color;
  }
}

export function findFullLines(grid: Grid): Lines {
  const rows: number[] = [];
  const cols: number[] = [];

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].every((color) => color !== null)) rows.push(i);
    if (grid.every((line) => line[i] !== null)) cols.push(i);
  }
  return { rows, cols };
}

export function clearLines(grid: Grid, lines: Lines): ColoredCell[] {
  const cleared: ColoredCell[] = [];

  grid.forEach((line, row) => {
    line.forEach((color, col) => {
      if (color === null) return;
      if (!lines.rows.includes(row) && !lines.cols.includes(col)) return;
      cleared.push({ row, col, color });
      line[col] = null;
    });
  });
  return cleared;
}

export function linesCompletedBy(grid: Grid, piece: Piece, at: Cell): Lines {
  const copy = grid.map((line) => [...line]);
  placePiece(copy, piece, at);
  return findFullLines(copy);
}

export function canFitAnywhere(grid: Grid, piece: Piece): boolean {
  for (let row = 0; row <= grid.length - piece.rows; row++) {
    for (let col = 0; col <= grid.length - piece.cols; col++) {
      if (canPlace(grid, piece, { row, col })) return true;
    }
  }
  return false;
}
