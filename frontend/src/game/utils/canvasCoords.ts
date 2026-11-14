import type { Point } from "../types";

// переводит координаты экрана в логические координаты игры (width × height),
// независимо от CSS-размера canvas и devicePixelRatio
export function clientToCanvas(
  element: HTMLElement,
  event: PointerEvent,
  width: number,
  height: number,
): Point {
  const rect = element.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left) * (width / rect.width),
    y: (event.clientY - rect.top) * (height / rect.height),
  };
}
