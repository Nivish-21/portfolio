"use client";

import { useEffect, useState } from "react";
import { RevLights } from "./RevLights";
import { TelemetryTrace } from "./TelemetryTrace";
import { useArcade } from "@/context/ArcadeContext";
// import { Hud } from "./Hud";

export function Hero() {
  const { openArcade } = useArcade();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="snap-section relative pt-10 pb-6 overflow-hidden">
      <TelemetryTrace />
      <div className="relative mx-auto w-full max-w-content px-6 md:px-8">
        <div className="mb-2">
          <RevLights />
        </div>

        <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-muted mt-5 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          AI-native builder &middot; ships fast, 0 &rarr; 1
        </div>

        <h1 className="font-display font-extrabold uppercase leading-[0.92] text-[clamp(2.75rem,9vw,7.5rem)] tracking-[0.004em]">
          <span className="block overflow-hidden">
            <span
              className={`block transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                animate ? "translate-y-0 opacity-100" : "translate-y-[105%] opacity-0"
              }`}
            >
              Ship <span className="text-accent">first.</span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className={`block text-muted transition-[transform,opacity] duration-700 delay-[120ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                animate ? "translate-y-0 opacity-100" : "translate-y-[105%] opacity-0"
              }`}
            >
              Scale later.
            </span>
          </span>
        </h1>

        <p
          className={`font-mono text-sm tracking-[0.05em] text-ink mt-4 transition-opacity duration-500 delay-[450ms] ${
            animate ? "opacity-100" : "opacity-0"
          }`}
        >
          Nivish Vincent Raj{" "}
          <span className="text-muted">— Founding CTO &amp; Backend Engineer, based in Tamil Nadu, India</span>
        </p>

        <p
          className={`font-mono text-[13px] tracking-[0.06em] text-muted mt-5 transition-opacity duration-500 delay-500 ${
            animate ? "opacity-100" : "opacity-0"
          }`}
        >
          {"// build first · optimise later"}
        </p>

        <div
          className={`mt-7 transition-[transform,opacity] duration-500 delay-[600ms] ${
            animate ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={openArcade}
            className="cursor-pointer bg-accent px-6 py-2.5 font-display text-sm font-bold uppercase italic tracking-[0.08em] text-on-accent transition-colors hover:brightness-110"
          >
            ▸ Enter Pit Arcade
          </button>
        </div>

        {/* <div
          className={`transition-[transform,opacity] duration-500 delay-[550ms] ${
            animate ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
          }`}
        >
          <Hud />
        </div> */}
      </div>
    </header>
  );
}
