import { useEffect, useRef } from "react";
import { blockBlastGame } from "../game";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = blockBlastGame(canvas);
    return game.stop;
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        maxWidth: "800px",
        aspectRatio: "4 / 3",
        margin: "10px auto",
        borderRadius: "16px",
        touchAction: "none",
      }}
    />
  );
}
