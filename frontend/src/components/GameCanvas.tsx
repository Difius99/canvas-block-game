import { useEffect, useRef } from "react";
import blockBlastGame from "../game/blockBlastGame";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = blockBlastGame(canvas);
    return game?.stop;
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "800px",
        height: "600px",
        border: "1px solid red",
        margin: "10px",
        touchAction: "none",
      }}
    />
  );
}
