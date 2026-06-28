"use client";

import { RefObject, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type UseOpeningScrollOptions = {
  rootRef: RefObject<HTMLElement | null>;
  onProgress: (progress: number) => void;
};

export function useOpeningScroll({ rootRef, onProgress }: UseOpeningScrollOptions) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const tweenTarget = { value: 0 };
    const context = gsap.context(() => {
      gsap.to(tweenTarget, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => onProgress(self.progress),
        },
      });
    }, root);

    onProgress(0);

    return () => context.revert();
  }, [onProgress, rootRef]);
}
