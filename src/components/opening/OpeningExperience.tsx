"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { OpeningThreeStage } from "./OpeningThreeStage";

const OPENING_DURATION_SECONDS = 8;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};

export function OpeningExperience() {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const driver = { value: 0 };
    const tween = gsap.to(driver, {
      value: 1,
      duration: OPENING_DURATION_SECONDS,
      ease: "power1.inOut",
      onUpdate: () => {
        progressRef.current = driver.value;
        setProgress(driver.value);
      },
      onComplete: () => {
        progressRef.current = 1;
        setProgress(1);
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  const copyProgress = smoothstep(0.68, 0.88, progress);

  return (
    <main className="opening-page">
      <div className="opening-stage">
        <OpeningThreeStage progressRef={progressRef} />
        <div className="opening-vignette" />
        <section
          className="opening-statement"
          style={{
            opacity: copyProgress,
            transform: `translate3d(-50%, ${18 - copyProgress * 18}px, 0)`,
          }}
          aria-label="Zless brand statement"
        >
          <p>Zero Limits.</p>
          <p>Endless Success.</p>
          <span>ゼロから、新しい価値を創る。</span>
        </section>
      </div>
    </main>
  );
}
