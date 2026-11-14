import { CLEAR_ANIM_MS, POINTS_PER_LINE } from "../config";
import { dragPieceOrigin, nearestCell } from "../layout";
import { createState, type GameState } from "../state/createState";
import {
  canFitAnywhere,
  canPlace,
  clearLines,
  findFullLines,
  linesCompletedBy,
  placePiece,
  type Lines,
} from "../state/grid";
import { createTray } from "../state/pieces";
import type { Point } from "../types";

const NO_LINES: Lines = { rows: [], cols: [] };

export function startDrag(
  state: GameState,
  trayIndex: number,
  pointer: Point,
  grabOffset: Point,
): void {
  if (state.gameOver || !state.tray[trayIndex]) return;

  state.drag = { trayIndex, pointer, grabOffset, target: null, lines: NO_LINES };
  updateDrag(state, pointer);
}

export function updateDrag(state: GameState, pointer: Point): void {
  const drag = state.drag;
  if (!drag) return;
  const piece = state.tray[drag.trayIndex];
  if (!piece) return;

  drag.pointer = pointer;
  const cell = nearestCell(dragPieceOrigin(drag));

  if (canPlace(state.grid, piece, cell)) {
    drag.target = cell;
    drag.lines = linesCompletedBy(state.grid, piece, cell);
  } else {
    drag.target = null;
    drag.lines = NO_LINES;
  }
}

export function cancelDrag(state: GameState): void {
  state.drag = null;
}

// возвращает true, если фигура поставлена на поле
export function endDrag(state: GameState): boolean {
  const drag = state.drag;
  state.drag = null;
  if (!drag?.target) return false;
  const piece = state.tray[drag.trayIndex];
  if (!piece) return false;

  placePiece(state.grid, piece, drag.target);
  state.tray[drag.trayIndex] = null;
  state.score += piece.cells.length;

  const lines = findFullLines(state.grid);
  const lineCount = lines.rows.length + lines.cols.length;

  if (lineCount > 0) {
    state.combo += 1;
    state.score += POINTS_PER_LINE * lineCount * state.combo;
    state.effects.push({ cells: clearLines(state.grid, lines), elapsedMs: 0 });
  } else {
    state.combo = 0;
  }

  if (state.tray.every((p) => p === null)) state.tray = createTray();

  state.best = Math.max(state.best, state.score);
  state.gameOver = !state.tray.some(
    (p) => p !== null && canFitAnywhere(state.grid, p),
  );
  return true;
}

export function restart(state: GameState): void {
  Object.assign(state, createState(state.best));
}

export function update(state: GameState, dtMs: number): void {
  for (const effect of state.effects) effect.elapsedMs += dtMs;
  state.effects = state.effects.filter((e) => e.elapsedMs < CLEAR_ANIM_MS);
}
