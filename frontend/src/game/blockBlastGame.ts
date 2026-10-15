import { createRafLoop } from "./engine/loop";
import { createCellDragHandlers } from "./input/dragHandlers";
import { attachPointerListeners } from "./input/pointerListeners";
import { createState } from "./state/createState";
import { clientToCanvas } from "./utils/canvasCoords";

export default function blockBlastGame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D context");

  const state = createState();

  canvas.width = state.getCanvasW();
  canvas.height = state.getCanvasH();

  const pointerHandlers = createCellDragHandlers({
    canvas,
    toPoint: (event) => clientToCanvas(canvas, event),

    getCell: () => state.getCell(),

    getPos: () => state.getSquarePos(),
    setPos: (x, y) => state.setSquarePos(x, y),

    isDragging: () => state.isDragging(),
    setDragging: (value) => state.setDragging(value),

    getOffset: () => state.getOffset(),
    setOffset: (x, y) => state.setOffset(x, y),
  });

  const inputBinding = attachPointerListeners({
    element: canvas,
    pointerHandlers,
  });

  function draw() {
    if (!ctx || !canvas) return;
    const { x, y } = state.getSquarePos();
    const size = state.getCell();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, size, size);
  }

  const loop = createRafLoop({
    tick: () => draw(),
  });

  loop.start();

  return {
    stop() {
      loop.stop();
      inputBinding.destroy();
    },
  };
}
