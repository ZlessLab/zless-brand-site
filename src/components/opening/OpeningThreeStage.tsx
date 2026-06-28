"use client";

import { RefObject, useEffect, useRef } from "react";
import { ZlessOpeningScene } from "@/scene/ZlessOpeningScene";

type OpeningThreeStageProps = {
  progressRef: RefObject<number>;
};

export function OpeningThreeStage({ progressRef }: OpeningThreeStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<ZlessOpeningScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new ZlessOpeningScene(canvas);
    sceneRef.current = scene;

    let frame = 0;
    const syncProgress = () => {
      scene.setProgress(progressRef.current);
      frame = requestAnimationFrame(syncProgress);
    };
    syncProgress();

    return () => {
      cancelAnimationFrame(frame);
      scene.destroy();
      sceneRef.current = null;
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="opening-three-canvas" aria-hidden="true" />;
}
