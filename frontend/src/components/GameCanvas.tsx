import { useEffect, useRef } from "react";
import { blockBlastGame } from "../game";

type GameCanvasProps = {
  onGameOver?: (score: number) => void;
};

export default function GameCanvas({ onGameOver }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // игра создаётся один раз, поэтому свежий колбэк читаем через ref
  const onGameOverRef = useRef(onGameOver);
  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = blockBlastGame(canvas, {
      onGameOver: (score) => onGameOverRef.current?.(score),
    });
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
        borderRadius: "16px",
        touchAction: "none",
      }}
    />
  );
}
