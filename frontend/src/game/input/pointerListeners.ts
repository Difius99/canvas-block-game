export type PointerHandlers = {
  onDown?: (e: PointerEvent) => void;
  onMove?: (e: PointerEvent) => void;
  onUp?: (e: PointerEvent) => void;
};

export type AttachPointerListenersProps = {
  element: HTMLElement;
  pointerHandlers: PointerHandlers;
};

export type InputBinding = { destroy(): void };

export function attachPointerListeners({
  element,
  pointerHandlers,
}: AttachPointerListenersProps): InputBinding {
  const { onDown, onMove, onUp } = pointerHandlers;

  if (onMove) element.addEventListener("pointermove", onMove);
  if (onDown) element.addEventListener("pointerdown", onDown);
  if (onUp) element.addEventListener("pointerup", onUp);

  return {
    destroy() {
      if (onMove) element.removeEventListener("pointermove", onMove);
      if (onDown) element.removeEventListener("pointerdown", onDown);
      if (onUp) element.removeEventListener("pointerup", onUp);
    },
  };
}
