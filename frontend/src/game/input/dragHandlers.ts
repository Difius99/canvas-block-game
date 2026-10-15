import type { PointerHandlers } from "./pointerListeners";

export type Point = { x: number; y: number };

export type CellDragDeps = {
  canvas: HTMLCanvasElement;
  toPoint: (e: PointerEvent) => Point;

  getCell: () => number;

  getPos: () => Point;
  setPos: (x: number, y: number) => void;

  isDragging: () => boolean;
  setDragging: (value: boolean) => void;

  getOffset: () => Point;
  setOffset: (x: number, y: number) => void;
};

export function createCellDragHandlers(deps: CellDragDeps): PointerHandlers {
  const {
    canvas,
    toPoint,
    getCell,
    getPos,
    setPos,
    isDragging,
    setDragging,
    getOffset,
    setOffset,
  } = deps;

  function hitTest(point: Point): boolean {
    const pos = getPos();
    const size = getCell();

    return (
      point.x >= pos.x &&
      point.x <= pos.x + size &&
      point.y >= pos.y &&
      point.y <= pos.y + size
    );
  }

  return {
    onDown(e) {
      const point = toPoint(e);
      if (!hitTest(point)) return;

      const pos = getPos();
      setDragging(true);
      setOffset(point.x - pos.x, point.y - pos.y);

      canvas.setPointerCapture(e.pointerId);
    },

    onMove(e) {
      if (!isDragging()) return;

      const point = toPoint(e);
      const offset = getOffset();
      setPos(point.x - offset.x, point.y - offset.y);
    },

    onUp(e) {
      if (!isDragging()) return;

      setDragging(false);
      canvas.releasePointerCapture(e.pointerId);
    },
  };
}
