export const CANVAS_W = 800;
export const CANVAS_H = 600;

export const GRID_SIZE = 8;
export const CELL = 60;

export const BOARD_X = 40;
export const BOARD_Y = 80;

export const TRAY_SIZE = 3;
export const TRAY_X = 560;
export const TRAY_Y = 80;
export const TRAY_W = 200;
export const TRAY_SLOT_H = 160;
export const TRAY_SCALE = 0.5;

// на тач-экране фигура поднимается над пальцем, чтобы её было видно
export const TOUCH_LIFT = 80;

export const POINTS_PER_LINE = 10;
export const CLEAR_ANIM_MS = 300;

export const PIECE_COLORS = [
  "#ff5a5f",
  "#ff9f1c",
  "#ffd23f",
  "#3ddc84",
  "#3fa7ff",
  "#8c5cff",
  "#ff6fb5",
] as const;

export const THEME = {
  background: "#1f2b5c",
  board: "#16204a",
  emptyCell: "#26336b",
  traySlot: "rgba(255, 255, 255, 0.04)",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.65)",
  accent: "#ffc93c",
  buttonText: "#1f2b5c",
  overlay: "rgba(10, 14, 35, 0.75)",
  blockHighlight: "rgba(255, 255, 255, 0.28)",
  blockEdge: "rgba(0, 0, 0, 0.25)",
} as const;
