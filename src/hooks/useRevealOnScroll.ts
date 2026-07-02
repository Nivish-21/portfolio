"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      const frame = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(frame);
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return { ref, revealed };
}
