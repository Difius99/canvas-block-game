const BEST_SCORE_KEY = "block-blast:best";

export function loadBestScore(): number {
  try {
    const value = Number(localStorage.getItem(BEST_SCORE_KEY));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score: number): void {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // хранилище недоступно (приватный режим и т.п.) — рекорд просто не сохранится
  }
}
