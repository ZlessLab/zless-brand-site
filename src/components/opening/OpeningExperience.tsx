"use client";

import { useCallback, useRef, useState } from "react";
import { useOpeningScroll } from "@/hooks/useOpeningScroll";
import { getOpeningSceneIndex, OPENING_SCENES } from "@/scene/openingScenes";
import { OpeningHeader } from "./OpeningHeader";
import { OpeningLogo } from "./OpeningLogo";
import { OpeningNarrative } from "./OpeningNarrative";
import { OpeningThreeStage } from "./OpeningThreeStage";

export function OpeningExperience() {
  const rootRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleProgress = useCallback((progress: number) => {
    progressRef.current = progress;
    setActiveIndex(getOpeningSceneIndex(progress));
  }, []);

  useOpeningScroll({ rootRef, onProgress: handleProgress });

  return (
    <main ref={rootRef} className="opening-page">
      <OpeningHeader />
      <div className="opening-stage">
        <OpeningThreeStage progressRef={progressRef} />
        <div className="opening-vignette" />
        <OpeningNarrative activeIndex={activeIndex} />
        <div className={`opening-mini-brand ${activeIndex === OPENING_SCENES.length - 1 ? "is-visible" : ""}`}>
          <OpeningLogo className="opening-mini-mark" />
          <span>Zless</span>
        </div>
        <div className={`opening-menu-lines ${activeIndex === OPENING_SCENES.length - 1 ? "is-visible" : ""}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="opening-scroll-cue">
          <span>SCROLL</span>
          <i />
        </div>
      </div>
      <div className="opening-scroll-space" aria-hidden="true">
        {OPENING_SCENES.map((scene) => (
          <section key={scene.id} className="opening-scroll-chapter" />
        ))}
      </div>
    </main>
  );
}
