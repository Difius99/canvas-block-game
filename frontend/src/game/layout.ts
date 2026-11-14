import {
  BOARD_X,
  BOARD_Y,
  CANVAS_H,
  CANVAS_W,
  CELL,
  GRID_SIZE,
  TRAY_SCALE,
  TRAY_SLOT_H,
  TRAY_W,
  TRAY_X,
  TRAY_Y,
} from "./config";
import type { Piece } from "./state/pieces";
import type { Cell, Point, Rect } from "./types";

export const BOARD_RECT: Rect = {
  x: BOARD_X,
  y: BOARD_Y,
  w: GRID_SIZE * CELL,
  h: GRID_SIZE * CELL,
};

export const RESTART_BUTTON: Rect = {
  x: CANVAS_W / 2 - 100,
  y: CANVAS_H / 2 + 40,
  w: 200,
  h: 56,
};

export function containsPoint(rect: Rect, point: Point): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.w &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.h
  );
}

export function traySlotRect(index: number): Rect {
  return {
    x: TRAY_X,
    y: TRAY_Y + index * TRAY_SLOT_H,
    w: TRAY_W,
    h: TRAY_SLOT_H,
  };
}

// левый верхний угол уменьшенной фигуры, отцентрированной в слоте
export function trayPieceOrigin(piece: Piece, index: number): Point {
  const slot = traySlotRect(index);
  const size = CELL * TRAY_SCALE;
  return {
    x: slot.x + (slot.w - piece.cols * size) / 2,
    y: slot.y + (slot.h - piece.rows * size) / 2,
  };
}

export function cellOrigin(cell: Cell): Point {
  return { x: BOARD_X + cell.col * CELL, y: BOARD_Y + cell.row * CELL };
}

export function nearestCell(point: Point): Cell {
  return {
    row: Math.round((point.y - BOARD_Y) / CELL),
    col: Math.round((point.x - BOARD_X) / CELL),
  };
}

export function dragPieceOrigin(drag: {
  pointer: Point;
  grabOffset: Point;
}): Point {
  return {
    x: drag.pointer.x - drag.grabOffset.x,
    y: drag.pointer.y - drag.grabOffset.y,
  };
}
