"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const BEST_KEY = "nvr-race-best";

// Internal canvas resolution (CSS scales it responsively via aspect-ratio).
const W = 960;
const H = 540;
const HORIZON = H * 0.42;
const SEGL = 200;
const DRAW = 90;
const MAXSP = SEGL * 60; // segments/sec, scaled

// Theme palette — the Mercedes petronas-teal translation of the original Ferrari-red racer.
const C = {
  bg: "#0e1413",
  skyTop: "#0e1413",
  skyBot: "#17201e",
  horizon: "rgba(0,210,190,.16)",
  grassA: "#0f1613",
  grassB: "#0c120f",
  roadA: "#1d2725",
  roadB: "#17201e",
  kerbLit: "#00d2be",
  kerbPlain: "#e9eeec",
  rumble: "#35433f",
  carBody: "#00d2be",
  carBodyDk: "#00a99a",
  carCrash: "#ea5a44",
  cockpit: "#0e1413",
  wheelRim: "#35433f",
  ink: "#e9eeec",
  offTrack: "rgba(234,90,68,.10)",
} as const;

const TRAFFIC = ["#00d2be", "#f2c230", "#25d98a", "#c56bf0", "#e9eeec"];

interface Seg {
  curve: number;
}
interface Car {
  z: number;
  x: number;
  spd: number;
  c: string;
}
interface Row {
  y: number;
  x: number;
  w: number;
  band: number;
}

export function ApexRush({ onBack }: { onBack: () => void }) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spdRef = useRef<HTMLElement | null>(null);
  const timeRef = useRef<HTMLElement | null>(null);
  const distRef = useRef<HTMLElement | null>(null);
  const restartRef = useRef<() => void>(() => {});

  const [finished, setFinished] = useState(false);
  const [note, setNote] = useState("← → steer · stay off the grass · traffic costs speed");
  const [best, setBest] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = Number(localStorage.getItem(BEST_KEY));
    return stored > 0 ? stored : null;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const keys = { left: false, right: false };
    let segs: Seg[] = [];
    let cars: Car[] = [];
    const rows: Row[] = [];
    let pos = 0;
    let playerX = 0;
    let speed = 0;
    let raceOn = false;
    let raf = 0;
    let tLeft = 60;
    let dist = 0;
    let lastT = 0;
    let crashT = 0;

    const buildTrack = () => {
      segs = [];
      const add = (n: number, curve: number) => {
        for (let i = 0; i < n; i++) segs.push({ curve });
      };
      add(40, 0); add(50, 2); add(30, 0); add(60, -3); add(40, 0); add(50, 4);
      add(40, -2); add(30, 0); add(45, -4); add(35, 0); add(55, 3); add(50, 0);
      add(40, 5); add(40, -5); add(45, 0);
    };
    buildTrack();
    const seg = (i: number) => segs[((i % segs.length) + segs.length) % segs.length];

    const spawnCars = () => {
      cars = [];
      for (let i = 0; i < 14; i++) {
        cars.push({
          z: (i + 1) * ((segs.length * SEGL) / 15),
          x: Math.random() * 1.4 - 0.7,
          spd: MAXSP * (0.35 + Math.random() * 0.25),
          c: TRAFFIC[i % TRAFFIC.length],
        });
      }
    };

    const drawPoly = (
      color: string,
      x1: number, y1: number, w1: number,
      x2: number, y2: number, w2: number
    ) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1 - w1, y1);
      ctx.lineTo(x1 + w1, y1);
      ctx.lineTo(x2 + w2, y2);
      ctx.lineTo(x2 - w2, y2);
      ctx.closePath();
      ctx.fill();
    };

    const buildRows = () => {
      rows.length = 0;
      const baseI = Math.floor(pos / SEGL);
      const frac = (pos % SEGL) / SEGL;
      let xa = 0;
      let dxa = -seg(baseI).curve * frac * 3.4;
      for (let n = 0; n <= DRAW; n++) {
        const zn = n + 1 - frac;
        const w = (W * 0.46) / zn;
        rows.push({
          y: HORIZON + (H - HORIZON) / zn,
          x: W / 2 + xa / zn - playerX * w,
          w,
          band: Math.floor((baseI + n) / 3) % 2,
        });
        dxa += seg(baseI + n).curve * 3.4;
        xa += dxa;
      }
    };

    const carSprite = (x: number, y: number, w: number, color: string) => {
      if (w < 3 || y < HORIZON + 2) return;
      const h = w * 0.62;
      ctx.fillStyle = "rgba(0,0,0,.45)";
      ctx.fillRect(x - w * 0.5, y - h * 0.06, w, h * 0.12);
      ctx.fillStyle = C.cockpit;
      ctx.fillRect(x - w * 0.56, y - h * 0.58, w * 0.2, h * 0.58);
      ctx.fillRect(x + w * 0.36, y - h * 0.58, w * 0.2, h * 0.58);
      ctx.fillStyle = color;
      ctx.fillRect(x - w * 0.4, y - h * 0.78, w * 0.8, h * 0.72);
      ctx.fillStyle = "rgba(14,20,19,.85)";
      ctx.fillRect(x - w * 0.18, y - h * 0.72, w * 0.36, h * 0.3);
      ctx.fillStyle = color;
      ctx.fillRect(x - w * 0.48, y - h * 0.98, w * 0.96, h * 0.16);
    };

    const playerCar = () => {
      const pw = 168;
      const ph = 96;
      const jitter = crashT > 0 && !reducedMotion ? Math.random() * 8 - 4 : 0;
      const x = W / 2 + jitter;
      const y = H - 24;
      const lean = (keys.left ? -1 : 0) + (keys.right ? 1 : 0);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(lean * 0.05);
      ctx.fillStyle = "rgba(0,0,0,.5)";
      ctx.beginPath();
      ctx.ellipse(0, 0, pw * 0.58, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = C.cockpit;
      ctx.fillRect(-pw * 0.6, -ph * 0.52, pw * 0.22, ph * 0.52);
      ctx.fillRect(pw * 0.38, -ph * 0.52, pw * 0.22, ph * 0.52);
      ctx.fillStyle = C.wheelRim;
      ctx.fillRect(-pw * 0.56, -ph * 0.3, pw * 0.14, ph * 0.12);
      ctx.fillRect(pw * 0.42, -ph * 0.3, pw * 0.14, ph * 0.12);
      ctx.fillStyle = crashT > 0 ? C.carCrash : C.carBody;
      ctx.fillRect(-pw * 0.34, -ph * 0.62, pw * 0.68, ph * 0.58);
      ctx.fillStyle = C.carBodyDk;
      ctx.fillRect(-pw * 0.34, -ph * 0.2, pw * 0.68, ph * 0.16);
      ctx.fillStyle = C.cockpit;
      ctx.fillRect(-pw * 0.13, -ph * 0.58, pw * 0.26, ph * 0.22);
      ctx.fillStyle = C.ink;
      ctx.fillRect(-pw * 0.5, -ph * 0.92, pw, ph * 0.13);
      ctx.fillRect(-pw * 0.5, -ph * 0.92, pw * 0.06, ph * 0.34);
      ctx.fillRect(pw * 0.44, -ph * 0.92, pw * 0.06, ph * 0.34);
      ctx.fillStyle = C.cockpit;
      ctx.font = `italic 700 ${Math.round(ph * 0.28)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("01", 0, -ph * 0.3);
      ctx.restore();
    };

    const render = () => {
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);
      const sky = ctx.createLinearGradient(0, 0, 0, HORIZON + 30);
      sky.addColorStop(0, C.skyTop);
      sky.addColorStop(1, C.skyBot);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, HORIZON + 30);
      ctx.fillStyle = C.horizon;
      ctx.fillRect(0, HORIZON - 3, W, 3);

      buildRows();
      for (let n = DRAW - 1; n >= 0; n--) {
        const a = rows[n + 1];
        const b = rows[n];
        if (b.y <= a.y || a.y > H) continue;
        ctx.fillStyle = b.band ? C.grassA : C.grassB;
        ctx.fillRect(0, a.y, W, b.y - a.y + 1);
        drawPoly(b.band ? C.kerbLit : C.kerbPlain, b.x, b.y, b.w * 1.12, a.x, a.y, a.w * 1.12);
        drawPoly(b.band ? C.roadA : C.roadB, b.x, b.y, b.w, a.x, a.y, a.w);
        if (b.band) drawPoly(C.rumble, b.x, b.y, b.w * 0.014, a.x, a.y, a.w * 0.014);
      }

      const trackLen = segs.length * SEGL;
      [...cars]
        .map((c) => ({ c, rel: (c.z - pos + trackLen) % trackLen }))
        .filter((o) => o.rel > SEGL * 0.5 && o.rel < (DRAW - 2) * SEGL)
        .sort((p, q) => q.rel - p.rel)
        .forEach(({ c, rel }) => {
          const f = rel / SEGL;
          const n0 = Math.floor(f);
          const t = f - n0;
          const r0 = rows[n0];
          const r1 = rows[Math.min(n0 + 1, DRAW)];
          const y = r0.y + (r1.y - r0.y) * t;
          const w = r0.w + (r1.w - r0.w) * t;
          const x = r0.x + (r1.x - r0.x) * t + c.x * w;
          carSprite(x, y, w * 0.3, c.c);
        });

      playerCar();
      if (Math.abs(playerX) > 1.05) {
        ctx.fillStyle = C.offTrack;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const stopRace = () => {
      raceOn = false;
      cancelAnimationFrame(raf);
    };

    const endRace = () => {
      stopRace();
      render();
      const d = Math.round(dist);
      const prev = Number(localStorage.getItem(BEST_KEY)) || 0;
      const isRecord = d > prev;
      if (isRecord) {
        localStorage.setItem(BEST_KEY, String(d));
        setBest(d);
      }
      setFinished(true);
      setNote(
        `CHEQUERED FLAG — ${d} M` +
          (isRecord ? " · NEW TRACK RECORD" : prev ? ` · RECORD ${Math.max(prev, d)} M` : "") +
          " · press R or restart"
      );
    };

    const raceStep = (t: number) => {
      if (!raceOn) return;
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      tLeft -= dt;
      if (tLeft <= 0) {
        endRace();
        return;
      }

      const accel = MAXSP * 0.55;
      const decel = MAXSP * 0.8;
      speed = Math.min(speed + accel * dt, MAXSP * (crashT > 0 ? 0.35 : 1));
      if (crashT > 0) crashT -= dt;

      const baseI = Math.floor(pos / SEGL);
      const curve = seg(baseI).curve;
      const steer = (keys.left ? -1 : 0) + (keys.right ? 1 : 0);
      playerX += steer * dt * 1.6 * (speed / MAXSP + 0.3);
      playerX -= curve * dt * 0.28 * (speed / MAXSP); // centrifugal
      playerX = Math.max(-1.6, Math.min(1.6, playerX));
      if (Math.abs(playerX) > 1.05) speed = Math.max(speed - decel * 1.6 * dt, MAXSP * 0.25); // grass

      const trackLen = segs.length * SEGL;
      cars.forEach((c) => {
        c.z = (c.z + c.spd * dt) % trackLen;
        const rel = (c.z - pos + trackLen) % trackLen;
        if (rel < SEGL * 1.4 && Math.abs(c.x - playerX) < 0.34 && crashT <= 0) {
          crashT = 1;
          speed *= 0.3;
        }
      });

      pos = (pos + speed * dt) % trackLen;
      dist += (speed * dt) / 60; // metres-ish

      if (spdRef.current) spdRef.current.textContent = String(Math.round((speed / MAXSP) * 320));
      if (timeRef.current) timeRef.current.textContent = tLeft.toFixed(1);
      if (distRef.current) distRef.current.textContent = String(Math.round(dist));

      render();
      raf = requestAnimationFrame(raceStep);
    };

    const startRace = () => {
      stopRace();
      pos = 0;
      playerX = 0;
      speed = 0;
      tLeft = 60;
      dist = 0;
      crashT = 0;
      spawnCars();
      setFinished(false);
      setNote("← → steer · stay off the grass · traffic costs speed");
      raceOn = true;
      lastT = performance.now();
      raf = requestAnimationFrame(raceStep);
    };
    restartRef.current = startRace;

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") {
        keys.left = true;
        e.preventDefault();
      }
      if (k === "arrowright" || k === "d") {
        keys.right = true;
        e.preventDefault();
      }
      if (k === "r" && !raceOn) startRace();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") keys.left = false;
      if (k === "arrowright" || k === "d") keys.right = false;
    };
    const onPointerDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientX < r.left + r.width / 2) keys.left = true;
      else keys.right = true;
    };
    const clearKeys = () => {
      keys.left = false;
      keys.right = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", clearKeys);
    canvas.addEventListener("pointercancel", clearKeys);
    window.addEventListener("blur", clearKeys);

    startRace();

    return () => {
      stopRace();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", clearKeys);
      canvas.removeEventListener("pointercancel", clearKeys);
      window.removeEventListener("blur", clearKeys);
    };
  }, [reducedMotion]);

  const handleRestart = useCallback(() => restartRef.current(), []);

  return (
    <div className="flex w-full max-w-[900px] flex-col items-center gap-3">
      <div className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <span>
          SPD <b ref={spdRef} className="text-accent">0</b> KM/H
        </span>
        <span>
          TIME <b ref={timeRef} className="text-ink">60.0</b>
        </span>
        <span>
          DIST <b ref={distRef} className="text-ink">0</b> M
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full max-w-[900px] border border-line-strong bg-bg"
        style={{ aspectRatio: "16 / 9", touchAction: "none" }}
      />
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-2">
        {note}
      </p>
      <div className="flex items-center gap-4">
        {finished && (
          <button
            type="button"
            onClick={handleRestart}
            className="cursor-pointer bg-accent px-6 py-2 font-display text-sm font-bold uppercase italic tracking-[0.06em] text-on-accent transition-colors hover:brightness-110"
          >
            Restart
          </button>
        )}
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-muted-2 transition-colors hover:text-ink"
        >
          ◂ back to garage
        </button>
      </div>
      {best !== null && (
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-purple">
          Track record {best} m
        </p>
      )}
    </div>
  );
}
