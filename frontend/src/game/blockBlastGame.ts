import { CANVAS_H, CANVAS_W } from "./config";
import { update } from "./engine/game";
import { createRafLoop } from "./engine/loop";
import { createPieceDragHandlers } from "./input/dragHandlers";
import { attachPointerListeners } from "./input/pointerListeners";
import { render } from "./render/canvasRenderer";
import { createState } from "./state/createState";
import { clientToCanvas } from "./utils/canvasCoords";
import { loadBestScore, saveBestScore } from "./utils/storage";

export default function blockBlastGame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D context");

  // рисуем в логических координатах CANVAS_W × CANVAS_H, но с учётом плотности пикселей
  const dpr = window.devicePixelRatio || 1;
  canvas.width = CANVAS_W * dpr;
  canvas.height = CANVAS_H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const state = createState(loadBestScore());

  const pointerHandlers = createPieceDragHandlers({
    canvas,
    toPoint: (event) => clientToCanvas(canvas, event, CANVAS_W, CANVAS_H),
    state,
    onPlaced: () => saveBestScore(state.best),
  });

  const inputBinding = attachPointerListeners({
    element: canvas,
    pointerHandlers,
  });

  const loop = createRafLoop({
    tick: (dtMs) => {
      update(state, dtMs);
      render(ctx, state);
    },
  });

  loop.start();

  return {
    stop() {
      loop.stop();
      inputBinding.destroy();
    },
  };
}
