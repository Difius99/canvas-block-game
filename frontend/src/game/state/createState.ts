import type { Cell, Point } from "../types";
import { createGrid, type ColoredCell, type Grid, type Lines } from "./grid";
import { createTray, type Piece } from "./pieces";

export type DragState = {
  trayIndex: number;
  pointer: Point;
  // смещение от левого верхнего угла фигуры до указателя (в масштабе поля)
  grabOffset: Point;
  // клетка, куда встанет фигура, или null, если сюда поставить нельзя
  target: Cell | null;
  // линии, которые очистятся, если отпустить фигуру в target
  lines: Lines;
};

export type ClearEffect = {
  cells: ColoredCell[];
  elapsedMs: number;
};

export type GameState = {
  grid: Grid;
  tray: (Piece | null)[];
  score: number;
  best: number;
  combo: number;
  drag: DragState | null;
  effects: ClearEffect[];
  gameOver: boolean;
};

export function createState(best = 0): GameState {
  return {
    grid: createGrid(),
    tray: createTray(),
    score: 0,
    best,
    combo: 0,
    drag: null,
    effects: [],
    gameOver: false,
  };
}
