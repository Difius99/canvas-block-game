export type Tick = (dtMs: number, nowMs: number) => void;

export type Loop = {
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
};

export type RafLoopOptions = {
  maxDeltaMs?: number;
};

export type RafLoopProps = {
  tick: Tick;
  options?: RafLoopOptions;
};

export function createRafLoop({ tick, options }: RafLoopProps): Loop {
  const maxDeltaMs = options?.maxDeltaMs ?? 50;

  let rafId = 0;
  let running = false;
  let lastMs = 0;

  function frame(nowMs: number) {
    if (!running) return;

    if (lastMs === 0) lastMs = nowMs;

    let delta = nowMs - lastMs;
    lastMs = nowMs;

    if (delta < 0) delta = 0;
    if (delta > maxDeltaMs) delta = maxDeltaMs;

    tick(delta, nowMs);
    rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastMs = 0;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafId);
      rafId = 0;
      lastMs = 0;
    },
    isRunning() {
      return running;
    },
  };
}
