"use client";

import { useEffect, useRef, useState } from "react";
import { useRaceModeContext } from "@/context/RaceModeContext";
import {
  CIRCUIT,
  CircuitPoint,
  ZONE_SPEED_MULTIPLIER,
  OFF_TRACK_PX,
  OFF_TRACK_MULTIPLIER,
  CHECKPOINT_RADIUS_PX,
  distToSegment,
} from "@/lib/circuit";
import { HudPanel } from "./HudPanel";

const ACCEL = 0.4;
const BRAKE = 0.6;
const FRICTION = 0.95;
const MAX_SPEED_BASE = 6;
const MIN_SPEED_FOR_FULL_TURN = 1;
const TURN_RATE_MAX = 0.12;
const CAR_WIDTH = 20;
const CAR_HEIGHT = 36;
const CAMERA_LERP_FACTOR = 0.08;
const CAMERA_TOP_BAND = 0.3; // 30vh from top
const CAMERA_BOTTOM_BAND = 0.7; // 70vh from top

interface WorldPoints {
  [key: string]: { x: number; y: number };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function drawCar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  heading: number,
  velocity: number,
  steerAmount: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading);

  // Car lean proportional to steering (subtle tilt while turning)
  const leanFactor = steerAmount * Math.min(1, Math.abs(velocity) / MIN_SPEED_FOR_FULL_TURN);
  ctx.rotate(leanFactor * 0.06);

  const w = CAR_WIDTH;
  const h = CAR_HEIGHT;
  const cx = 0;
  const cy = 0;

  // Wedge nose (front taper)
  ctx.fillStyle = "#00d2be";
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx - w * 0.35, cy - h / 2 + h * 0.15);
  ctx.lineTo(cx + w * 0.35, cy - h / 2 + h * 0.15);
  ctx.closePath();
  ctx.fill();

  // Sculpted sidepods (main body)
  const podDepth = h * 0.5;
  ctx.beginPath();
  // Left side
  ctx.moveTo(cx - w * 0.35, cy - h / 2 + h * 0.15);
  ctx.quadraticCurveTo(cx - w * 0.45, cy - h / 2 + podDepth * 0.5, cx - w * 0.4, cy - h / 2 + podDepth);
  // Bottom
  ctx.lineTo(cx - w * 0.35, cy + h / 2 - h * 0.18);
  ctx.lineTo(cx + w * 0.35, cy + h / 2 - h * 0.18);
  // Right side
  ctx.quadraticCurveTo(cx + w * 0.45, cy - h / 2 + podDepth * 0.5, cx + w * 0.4, cy - h / 2 + podDepth);
  ctx.closePath();
  ctx.fill();

  // Cockpit/halo ring
  ctx.strokeStyle = "#00d2be";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy - h * 0.15, w * 0.25, 0, Math.PI * 2);
  ctx.stroke();

  // Rear wing (endplates + bar)
  ctx.fillStyle = "#00d2be";
  // Left endplate
  ctx.fillRect(cx - w * 0.4, cy + h / 2 - h * 0.15, 1.5, h * 0.12);
  // Right endplate
  ctx.fillRect(cx + w * 0.4 - 1.5, cy + h / 2 - h * 0.15, 1.5, h * 0.12);
  // Wing bar
  ctx.fillRect(cx - w * 0.4, cy + h / 2 - h * 0.12, w * 0.8, 2);

  ctx.restore();
}

export function RaceCanvas() {
  const { active, onMarkerHit, lapStartedAt } = useRaceModeContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const worldXRef = useRef(0);
  const worldYRef = useRef(0);
  const headingRef = useRef(0);
  const velocityRef = useRef(0);
  const motionTrailRef = useRef<Array<{ x: number; y: number }>>([]);
  const worldPointsCacheRef = useRef<WorldPoints>({});
  const lastCheckpointRef = useRef<string | null>(null);

  const [lapMs, setLapMs] = useState(0);
  const [currentZone, setCurrentZone] = useState<string>("NORMAL");

  // Initialize car position at start checkpoint (55%, 2%)
  useEffect(() => {
    if (!active) return;

    const docHeight = document.documentElement.scrollHeight;
    const docWidth = document.documentElement.scrollWidth;
    const startX = (CIRCUIT[0].xPct / 100) * docWidth;
    const startY = (CIRCUIT[0].yPct / 100) * docHeight;
    worldXRef.current = startX;
    worldYRef.current = startY;
    headingRef.current = 0;
    velocityRef.current = 0;
    motionTrailRef.current = [];
    lastCheckpointRef.current = null;
  }, [active]);

  // Compute world points cache
  const updateWorldPointsCache = () => {
    const docHeight = document.documentElement.scrollHeight;
    const docWidth = document.documentElement.scrollWidth;
    const points: WorldPoints = {};
    CIRCUIT.forEach((pt, idx) => {
      const key = `p${idx}`;
      points[key] = {
        x: (pt.xPct / 100) * docWidth,
        y: (pt.yPct / 100) * docHeight,
      };
    });
    worldPointsCacheRef.current = points;
  };

  // Update world points on mount and on resize
  useEffect(() => {
    if (!active) return;
    updateWorldPointsCache();
    const handleResize = () => updateWorldPointsCache();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [active]);

  // Keyboard input
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") keysRef.current["up"] = true;
      if (key === "arrowdown" || key === "s") keysRef.current["down"] = true;
      if (key === "arrowleft" || key === "a") keysRef.current["left"] = true;
      if (key === "arrowright" || key === "d") keysRef.current["right"] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "arrowup" || key === "w") keysRef.current["up"] = false;
      if (key === "arrowdown" || key === "s") keysRef.current["down"] = false;
      if (key === "arrowleft" || key === "a") keysRef.current["left"] = false;
      if (key === "arrowright" || key === "d") keysRef.current["right"] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [active]);

  // Size the canvas to the viewport on mount and on resize only — not per-frame
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [active]);

  // Main animation loop
  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      const { up, down, left, right } = keysRef.current;
      const docHeight = document.documentElement.scrollHeight;
      const docWidth = document.documentElement.scrollWidth;

      // Physics
      const throttle = (up ? 1 : 0) - (down ? 1 : 0);
      const steer = (right ? 1 : 0) - (left ? 1 : 0);

      let vel = velocityRef.current;
      vel += throttle * (throttle > 0 ? ACCEL : BRAKE);
      vel *= FRICTION;

      // Zone lookup
      let zoneMultiplier = 1;
      let minDist = Infinity;
      for (let i = 0; i < CIRCUIT.length; i++) {
        const next = (i + 1) % CIRCUIT.length;
        const p1Key = `p${i}`;
        const p2Key = `p${next}`;
        const p1 = worldPointsCacheRef.current[p1Key];
        const p2 = worldPointsCacheRef.current[p2Key];
        if (!p1 || !p2) continue;

        const dist = distToSegment({ x: worldXRef.current, y: worldYRef.current }, p1, p2);
        if (dist < minDist) {
          minDist = dist;
          const zone = CIRCUIT[i].zone;
          zoneMultiplier = ZONE_SPEED_MULTIPLIER[zone];

          // Update zone display
          if (zone === "drs") {
            setCurrentZone("DRS BOOST");
          } else if (zone === "corner") {
            setCurrentZone("CORNER");
          } else {
            setCurrentZone("STRAIGHT");
          }
        }
      }

      // Off-track penalty
      const offTrackMultiplier = minDist > OFF_TRACK_PX ? OFF_TRACK_MULTIPLIER : 1;
      zoneMultiplier *= offTrackMultiplier;

      vel = clamp(vel, -MAX_SPEED_BASE * 0.4, MAX_SPEED_BASE * zoneMultiplier);
      velocityRef.current = vel;

      // Steering (can't turn at standstill)
      const turnFactor = Math.min(1, Math.abs(vel) / MIN_SPEED_FOR_FULL_TURN);
      headingRef.current += steer * TURN_RATE_MAX * turnFactor;

      // Update position
      worldXRef.current += Math.cos(headingRef.current) * vel;
      worldYRef.current += Math.sin(headingRef.current) * vel;

      // Motion trail
      motionTrailRef.current.push({ x: worldXRef.current, y: worldYRef.current });
      if (motionTrailRef.current.length > 15) {
        motionTrailRef.current.shift();
      }

      // Checkpoint collision
      CIRCUIT.forEach((point) => {
        if (!point.checkpoint) return;
        const cpWorldX = (point.xPct / 100) * docWidth;
        const cpWorldY = (point.yPct / 100) * docHeight;
        const dist = Math.hypot(worldXRef.current - cpWorldX, worldYRef.current - cpWorldY);
        if (dist < CHECKPOINT_RADIUS_PX && lastCheckpointRef.current !== point.checkpoint) {
          lastCheckpointRef.current = point.checkpoint;
          onMarkerHit(point.checkpoint);
        }
      });

      // Camera follow
      const screenY = worldYRef.current - window.scrollY;
      const viewportHeight = window.innerHeight;
      const topBand = viewportHeight * CAMERA_TOP_BAND;
      const bottomBand = viewportHeight * CAMERA_BOTTOM_BAND;

      if (screenY < topBand || screenY > bottomBand) {
        const targetScrollY = worldYRef.current - viewportHeight * 0.5;
        const currentScrollY = window.scrollY;
        const nextScrollY = currentScrollY + (targetScrollY - currentScrollY) * CAMERA_LERP_FACTOR;
        window.scrollTo({ top: nextScrollY, behavior: "instant" });
      }

      // Update lap timer from the context's authoritative lap-start time (resets every lap;
      // a locally-tracked copy here previously never reset after the first lap)
      if (lapStartedAt !== null) {
        setLapMs(Math.round(performance.now() - lapStartedAt));
      } else {
        setLapMs(0);
      }

      // Canvas rendering (sizing handled by the resize effect, not per-frame — resizing a
      // canvas element clears its backing buffer, so doing it every frame is wasteful)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scrollY = window.scrollY;

      // Draw circuit
      const points = CIRCUIT.map((pt, idx) => {
        const key = `p${idx}`;
        const p = worldPointsCacheRef.current[key];
        return p ? { x: p.x, y: p.y - scrollY, point: pt } : null;
      }).filter((p) => p !== null) as Array<{ x: number; y: number; point: CircuitPoint }>;

      if (points.length > 1) {
        // Draw track ribbon
        ctx.strokeStyle = "#35433f";
        ctx.lineWidth = 28;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const midX = (prev.x + curr.x) / 2;
          const midY = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
        ctx.stroke();

        // Draw dashed centerline
        ctx.strokeStyle = "#a5b4af";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const midX = (prev.x + curr.x) / 2;
          const midY = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw DRS zone glow
        const drsSegments = points.filter((p) => p.point.zone === "drs");
        if (drsSegments.length > 0) {
          const glowOpacity = 0.5 + Math.sin(performance.now() / 200) * 0.3;
          ctx.strokeStyle = `rgba(0, 210, 190, ${glowOpacity})`;
          ctx.lineWidth = 40;
          ctx.setLineDash([]);
          ctx.beginPath();
          const first = drsSegments[0];
          ctx.moveTo(first.x, first.y);
          for (let i = 1; i < drsSegments.length; i++) {
            const prev = drsSegments[i - 1];
            const curr = drsSegments[i];
            const midX = (prev.x + curr.x) / 2;
            const midY = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
          }
          ctx.stroke();
        }

        // Draw flow chevrons (animated dashes)
        const flowDashOffset = (performance.now() / 50) % 12;
        ctx.strokeStyle = "rgba(0, 210, 190, 0.3)";
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 4]);
        ctx.lineDashOffset = -flowDashOffset;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const midX = (prev.x + curr.x) / 2;
          const midY = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw motion trail
      motionTrailRef.current.forEach((pos, idx) => {
        const alpha = (idx / motionTrailRef.current.length) * 0.4;
        const radius = 2 + (idx / motionTrailRef.current.length) * 3;
        ctx.fillStyle = `rgba(0, 210, 190, ${alpha})`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - scrollY, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw car
      drawCar(
        ctx,
        worldXRef.current,
        worldYRef.current - scrollY,
        headingRef.current,
        vel,
        steer
      );

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [active, onMarkerHit, lapStartedAt]);

  if (!active) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-40"
        style={{ touchAction: "none" }}
      />
      <HudPanel lapMs={lapMs} currentZone={currentZone} />
    </>
  );
}
