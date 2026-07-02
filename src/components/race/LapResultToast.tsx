"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRaceModeContext, type LapTone } from "@/context/RaceModeContext";
import { TONE_TEXT } from "@/lib/tones";

export function LapResultToast() {
  const { lastResult } = useRaceModeContext();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [offline, setOffline] = useState(true);
  const [qualifies, setQualifies] = useState(false);
  const [displayTone, setDisplayTone] = useState<LapTone>("off");
  const [isVisible, setIsVisible] = useState(false);
  
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFocusedRef = useRef(false);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = null;
    }
  }, []);

  const startDismissTimer = useCallback(() => {
    clearDismissTimer();
    dismissTimeoutRef.current = setTimeout(function tick() {
      if (!isFocusedRef.current) {
        setIsVisible(false);
      } else {
        dismissTimeoutRef.current = setTimeout(tick, 8000);
      }
    }, 8000); // 8 seconds display time
  }, [clearDismissTimer]);

  // Synchronize toast display when a new result arrives
  useEffect(() => {
    if (!lastResult) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setName("");
      setSubmitted(false);
      setSubmitting(false);
      setDisplayTone(lastResult.tone);
    });

    // Fetch leaderboard to compare rank and check connection
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.offline) {
          setOffline(true);
          setQualifies(false);
          return;
        }

        setOffline(false);
        const entries = data.entries || [];

        // Check if this lap qualifies for top 5
        const isTop5 = entries.length < 5 || lastResult.lapMs < entries[entries.length - 1].timeMs;
        setQualifies(isTop5 && lastResult.tone !== "off");

        // Upgrade tone to "best" if we beat the absolute global #1
        if (entries.length > 0 && lastResult.lapMs < entries[0].timeMs && lastResult.tone !== "off") {
          setDisplayTone("best");
        }
      })
      .catch((err) => {
        console.error("Leaderboard fetch error:", err);
        setOffline(true);
        setQualifies(false);
      });

    // Start auto-dismiss countdown
    startDismissTimer();

    return () => {
      cancelAnimationFrame(frame);
      clearDismissTimer();
    };
  }, [lastResult, startDismissTimer, clearDismissTimer]);

  // Sync visibility with lastResult
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(!!lastResult);
    });
    return () => cancelAnimationFrame(frame);
  }, [lastResult]);

  if (!lastResult || !isVisible) return null;

  const { lapMs, splits } = lastResult;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, timeMs: lapMs }),
      });
      if (res.ok) {
        setSubmitted(true);
        // Restart dismiss timer now that saving is done
        isFocusedRef.current = false;
        startDismissTimer();
      }
    } catch (err) {
      console.error("Failed to save to leaderboard:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 z-50 w-[90vw] max-w-[380px] -translate-x-1/2 border border-line-strong bg-panel/95 p-4 font-mono text-[11px] backdrop-blur-sm shadow-xl select-none"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-muted hover:text-ink cursor-pointer"
        aria-label="Close result log"
      >
        &times;
      </button>

      {/* Title block */}
      <div className="border-b border-line-strong pb-2 mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${TONE_TEXT[displayTone]}`}>
          {displayTone === "best"
            ? "🏁 NEW TRACK RECORD"
            : displayTone === "gain"
            ? "🏁 PERSONAL BEST"
            : displayTone === "mark"
            ? "🏁 LAP TIMED"
            : "🏁 OFF PACE"}
        </span>
        <h4 className="font-display font-extrabold text-base tracking-[0.02em] mt-0.5 text-ink">
          LAP TIME: {(lapMs / 1000).toFixed(3)}s
        </h4>
      </div>

      {/* Splits list */}
      <div className="grid grid-cols-3 gap-2 mb-3 border-b border-dashed border-line-strong pb-2">
        <div>
          <span className="text-[9px] uppercase tracking-[0.06em] text-muted block">SECTOR 1</span>
          <span className="text-ink font-semibold tabular-nums">{(splits[0] / 1000).toFixed(3)}s</span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-[0.06em] text-muted block">SECTOR 2</span>
          <span className="text-ink font-semibold tabular-nums">{(splits[1] / 1000).toFixed(3)}s</span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-[0.06em] text-muted block">SECTOR 3</span>
          <span className="text-ink font-semibold tabular-nums">{(splits[2] / 1000).toFixed(3)}s</span>
        </div>
      </div>

      {/* Leaderboard saving form */}
      {qualifies && !offline ? (
        submitted ? (
          <div className="text-green text-[10px] font-bold uppercase tracking-[0.05em] py-1">
            ✓ LAP TRANSMITTED TO LEADERBOARD
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-1.5">
            <label htmlFor="driver-name" className="text-[9px] uppercase tracking-[0.06em] text-muted">
              QUALIFIED FOR LEADERBOARD. ENTER SIGN:
            </label>
            <div className="flex gap-2">
              <input
                id="driver-name"
                type="text"
                maxLength={16}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => {
                  isFocusedRef.current = true;
                  clearDismissTimer();
                }}
                onBlur={() => {
                  isFocusedRef.current = false;
                  startDismissTimer();
                }}
                placeholder="DRIVER INITIALS"
                required
                className="flex-1 border border-line-strong bg-bg px-2 py-1 text-ink uppercase placeholder:text-muted-2 placeholder:lowercase focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer border border-line-strong bg-panel px-3 py-1 font-bold text-ink uppercase tracking-[0.08em] transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              >
                {submitting ? "SENDING..." : "SAVE"}
              </button>
            </div>
          </form>
        )
      ) : (
        <div className="text-[9px] uppercase tracking-[0.06em] text-muted-2 py-1">
          {offline
            ? "Leaderboard offline (local best still tracked)"
            : displayTone === "off"
            ? "Lap slower than threshold (+8%). No record."
            : lastResult.isNewPersonalBest
            ? "PB set. Did not qualify for Top 5 leaderboard."
            : "On pace, not a new PB."}
        </div>
      )}
    </div>
  );
}
