import { CANVAS_H, CANVAS_W, CELL, START_X, START_Y } from "../config";
import type { Point } from "../types";

export type StateConfig = {
  canvasW: number;
  canvasH: number;
  cell: number;
  startX: number;
  startY: number;
};

export type StateApi = {
  // config
  getCanvasW(): number;
  getCanvasH(): number;
  getCell(): number;

  // square
  getSquarePos(): Point;
  setSquarePos(x: number, y: number): void;

  // drag
  isDragging(): boolean;
  setDragging(value: boolean): void;

  getOffset(): Point;
  setOffset(x: number, y: number): void;
};

export function createState(partial: Partial<StateConfig> = {}): StateApi {
  const config: StateConfig = {
    canvasW: CANVAS_W,
    canvasH: CANVAS_H,
    cell: CELL,
    startX: START_X,
    startY: START_Y,
    ...partial,
  };

  let canvasW = config.canvasW;
  let canvasH = config.canvasH;
  let cell = config.cell;

  let squarePos: Point = { x: config.startX, y: config.startY };

  let dragging = false;
  let offset: Point = { x: 0, y: 0 };

  return {
    getCanvasW: () => canvasW,
    getCanvasH: () => canvasH,
    getCell: () => cell,

    getSquarePos: () => ({ ...squarePos }),
    setSquarePos: (x, y) => {
      squarePos = { x, y };
    },

    isDragging: () => dragging,
    setDragging: (value) => {
      dragging = value;
    },

    getOffset: () => ({ ...offset }),
    setOffset: (x, y) => {
      offset = { x, y };
    },
  };
}
