import { CELL, TOUCH_LIFT, TRAY_SCALE, TRAY_SIZE } from "../config";
import {
  cancelDrag,
  endDrag,
  restart,
  startDrag,
  updateDrag,
} from "../engine/game";
import {
  RESTART_BUTTON,
  containsPoint,
  trayPieceOrigin,
  traySlotRect,
} from "../layout";
import type { GameState } from "../state/createState";
import type { Point } from "../types";
import type { PointerHandlers } from "./pointerListeners";

export type PieceDragDeps = {
  canvas: HTMLCanvasElement;
  toPoint: (e: PointerEvent) => Point;
  state: GameState;
  onPlaced: () => void;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createPieceDragHandlers(deps: PieceDragDeps): PointerHandlers {
  const { canvas, toPoint, state, onPlaced } = deps;

  function findTrayIndex(point: Point): number {
    for (let i = 0; i < TRAY_SIZE; i++) {
      if (state.tray[i] && containsPoint(traySlotRect(i), point)) return i;
    }
    return -1;
  }

  function updateCursor(point: Point): void {
    let cursor = "default";
    if (state.drag) cursor = "grabbing";
    else if (state.gameOver) {
      if (containsPoint(RESTART_BUTTON, point)) cursor = "pointer";
    } else if (findTrayIndex(point) >= 0) cursor = "grab";
    canvas.style.cursor = cursor;
  }

  return {
    onDown(e) {
      const point = toPoint(e);

      if (state.gameOver) {
        if (containsPoint(RESTART_BUTTON, point)) restart(state);
        updateCursor(point);
        return;
      }

      const index = findTrayIndex(point);
      const piece = index >= 0 ? state.tray[index] : null;
      if (!piece) return;

      // точку захвата переводим из масштаба лотка в масштаб поля
      const origin = trayPieceOrigin(piece, index);
      const lift = e.pointerType === "touch" ? TOUCH_LIFT : 0;
      const grabOffset = {
        x: clamp((point.x - origin.x) / TRAY_SCALE, 0, piece.cols * CELL),
        y: clamp((point.y - origin.y) / TRAY_SCALE, 0, piece.rows * CELL) + lift,
      };

      startDrag(state, index, point, grabOffset);
      canvas.setPointerCapture(e.pointerId);
      updateCursor(point);
    },

    onMove(e) {
      const point = toPoint(e);
      updateDrag(state, point);
      updateCursor(point);
    },

    onUp(e) {
      if (!state.drag) return;

      if (endDrag(state)) onPlaced();
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
      updateCursor(toPoint(e));
    },

    onCancel() {
      cancelDrag(state);
    },
  };
}
