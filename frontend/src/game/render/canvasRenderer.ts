import {
  CANVAS_H,
  CANVAS_W,
  CELL,
  CLEAR_ANIM_MS,
  GRID_SIZE,
  THEME,
  TRAY_SCALE,
  TRAY_SIZE,
} from "../config";
import {
  BOARD_RECT,
  RESTART_BUTTON,
  cellOrigin,
  dragPieceOrigin,
  trayPieceOrigin,
  traySlotRect,
} from "../layout";
import type { GameState } from "../state/createState";
import { canFitAnywhere } from "../state/grid";
import type { Piece } from "../state/pieces";
import type { Point } from "../types";

const FONT = "system-ui, sans-serif";

export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = THEME.background;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawHeader(ctx, state);
  drawBoard(ctx, state);
  drawEffects(ctx, state);
  drawTray(ctx, state);
  drawDraggedPiece(ctx, state);

  if (state.gameOver) drawGameOver(ctx, state);
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha = 1,
): void {
  if (size < 2) return;
  const inset = Math.max(1, size * 0.04);
  const s = size - inset * 2;
  const radius = s * 0.14;

  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x + inset, y + inset, s, s, radius);
  ctx.fill();

  ctx.fillStyle = THEME.blockHighlight;
  ctx.beginPath();
  ctx.roundRect(x + inset + s * 0.1, y + inset + s * 0.08, s * 0.8, s * 0.25, radius * 0.6);
  ctx.fill();

  ctx.strokeStyle = THEME.blockEdge;
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.beginPath();
  ctx.roundRect(x + inset, y + inset, s, s, radius);
  ctx.stroke();

  ctx.restore();
}

function drawPiece(
  ctx: CanvasRenderingContext2D,
  piece: Piece,
  origin: Point,
  cellSize: number,
  alpha = 1,
): void {
  for (const { row, col } of piece.cells) {
    drawBlock(ctx, origin.x + col * cellSize, origin.y + row * cellSize, cellSize, piece.color, alpha);
  }
}

function drawHeader(ctx: CanvasRenderingContext2D, state: GameState): void {
  const y = BOARD_RECT.y / 2;
  ctx.textBaseline = "middle";

  ctx.fillStyle = THEME.textMuted;
  ctx.font = `16px ${FONT}`;
  ctx.textAlign = "left";
  ctx.fillText(`Рекорд: ${state.best}`, BOARD_RECT.x, y);

  ctx.fillStyle = THEME.text;
  ctx.font = `bold 36px ${FONT}`;
  ctx.textAlign = "center";
  ctx.fillText(String(state.score), BOARD_RECT.x + BOARD_RECT.w / 2, y);

  if (state.combo > 1) {
    ctx.fillStyle = THEME.accent;
    ctx.font = `bold 18px ${FONT}`;
    ctx.textAlign = "right";
    ctx.fillText(`Комбо x${state.combo}`, BOARD_RECT.x + BOARD_RECT.w, y);
  }
}

function drawBoard(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { grid, drag } = state;
  const piece = drag ? state.tray[drag.trayIndex] : null;
  const pad = 8;

  ctx.fillStyle = THEME.board;
  ctx.beginPath();
  ctx.roundRect(BOARD_RECT.x - pad, BOARD_RECT.y - pad, BOARD_RECT.w + pad * 2, BOARD_RECT.h + pad * 2, 12);
  ctx.fill();

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const { x, y } = cellOrigin({ row, col });
      const color = grid[row][col];

      if (color === null) {
        ctx.fillStyle = THEME.emptyCell;
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, CELL - 4, CELL - 4, 6);
        ctx.fill();
        continue;
      }

      // блоки в линиях, которые очистятся, подсвечиваются цветом фигуры
      const willClear =
        drag !== null && (drag.lines.rows.includes(row) || drag.lines.cols.includes(col));
      drawBlock(ctx, x, y, CELL, willClear && piece ? piece.color : color);
    }
  }

  if (drag?.target && piece) {
    drawPiece(ctx, piece, cellOrigin(drag.target), CELL, 0.4);
  }
}

function drawEffects(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const effect of state.effects) {
    const t = Math.min(1, effect.elapsedMs / CLEAR_ANIM_MS);
    const size = CELL * (1 - t);
    const offset = (CELL - size) / 2;

    for (const cell of effect.cells) {
      const { x, y } = cellOrigin(cell);
      drawBlock(ctx, x + offset, y + offset, size, cell.color, 1 - t);
    }
  }
}

function drawTray(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (let i = 0; i < TRAY_SIZE; i++) {
    const slot = traySlotRect(i);
    ctx.fillStyle = THEME.traySlot;
    ctx.beginPath();
    ctx.roundRect(slot.x + 6, slot.y + 6, slot.w - 12, slot.h - 12, 12);
    ctx.fill();

    const piece = state.tray[i];
    if (!piece || state.drag?.trayIndex === i) continue;

    // фигуры, которые никуда не помещаются, приглушены
    const alpha = canFitAnywhere(state.grid, piece) ? 1 : 0.35;
    drawPiece(ctx, piece, trayPieceOrigin(piece, i), CELL * TRAY_SCALE, alpha);
  }
}

function drawDraggedPiece(ctx: CanvasRenderingContext2D, state: GameState): void {
  const drag = state.drag;
  const piece = drag ? state.tray[drag.trayIndex] : null;
  if (!drag || !piece) return;

  drawPiece(ctx, piece, dragPieceOrigin(drag), CELL);
}

function drawGameOver(ctx: CanvasRenderingContext2D, state: GameState): void {
  const cx = CANVAS_W / 2;
  const cy = CANVAS_H / 2;

  ctx.fillStyle = THEME.overlay;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = THEME.text;
  ctx.font = `bold 44px ${FONT}`;
  ctx.fillText("Игра окончена", cx, cy - 80);

  ctx.font = `24px ${FONT}`;
  ctx.fillText(`Счёт: ${state.score}`, cx, cy - 30);

  if (state.score > 0 && state.score >= state.best) {
    ctx.fillStyle = THEME.accent;
    ctx.font = `bold 20px ${FONT}`;
    ctx.fillText("Новый рекорд!", cx, cy + 5);
  }

  const btn = RESTART_BUTTON;
  ctx.fillStyle = THEME.accent;
  ctx.beginPath();
  ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 12);
  ctx.fill();

  ctx.fillStyle = THEME.buttonText;
  ctx.font = `bold 24px ${FONT}`;
  ctx.fillText("Заново", btn.x + btn.w / 2, btn.y + btn.h / 2);
}
