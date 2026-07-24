"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type LoaderSize = "small" | "medium" | "large";

interface RadialLoaderProps {
  size?: LoaderSize | number;
  segmentCount?: number;
  speed?: number;
  activeColor?: string;
  direction?: "cw" | "ccw";
  className?: string;
}

const SIZE_MAP: Record<LoaderSize, number> = {
  small: 24,
  medium: 48,
  large: 96,
};

type Phase = "filling" | "rotating" | "reset";

export default function RadialLoader({
  size = "medium",
  segmentCount = 14,
  speed,
  activeColor,
  direction = "cw",
  className = "",
}: RadialLoaderProps) {
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const totalCycle = speed ?? (px <= 24 ? 0.8 : px <= 48 ? 1.2 : 1.8);
  const n = Math.min(Math.max(segmentCount, 8), 24);
  const w = Math.max(2, px * 0.07);
  const h = Math.max(6, px * 0.3);
  const r = px * 0.38;
  const g = Math.max(4, w * 3);

  // Read the accent color from CSS variable at render time
  const color = activeColor || "var(--primary-500, #3b82f6)";

  const [litCount, setLitCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("filling");
  const [rotation, setRotation] = useState(0);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (resetRef.current) clearTimeout(resetRef.current);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const ms = (totalCycle / n) * 1000;
    cleanup();

    if (phase === "filling") {
      tickRef.current = setInterval(() => {
        setLitCount((prev) => {
          const next = prev + 1;
          if (next > n) {
            cleanup();
            setPhase("rotating");
            return n;
          }
          return next;
        });
      }, ms);
    }

    if (phase === "rotating") {
      const start = performance.now();
      const rotateDur = totalCycle * 400;

      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / rotateDur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setRotation(eased * 360);

        if (t < 1) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          resetRef.current = setTimeout(() => {
            setLitCount(0);
            setRotation(0);
            setPhase("filling");
          }, 250);
        }
      };

      animRef.current = requestAnimationFrame(animate);
    }

    return cleanup;
  }, [phase, n, totalCycle, cleanup]);

  return (
    <span
      className={className}
      style={{
        width: px,
        height: px,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="status"
      aria-label="Loading"
      aria-busy="true"
    >
      <span className="sr-only">Loading...</span>
      <span
        style={{
          position: "relative",
          display: "block",
          width: px,
          height: px,
          transform: phase === "rotating" ? `rotate(${rotation}deg)` : "none",
          transition: phase !== "rotating" ? "none" : undefined,
        }}
      >
        {Array.from({ length: n }).map((_, i) => {
          const idx = direction === "cw" ? i : n - 1 - i;
          const isLit = idx < litCount;
          let opacity = 0.06;
          let shadow = "none";

          if (phase === "filling" && isLit) {
            const isLeading = idx === litCount - 1;
            opacity = isLeading ? 1 : 0.45;
            if (isLeading) {
              shadow = `0 0 ${g}px ${color}, 0 0 ${g * 2.5}px ${color}40`;
            }
          } else if (phase === "rotating" || phase === "reset") {
            opacity = 0.6;
          }

          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: w,
                height: h,
                transform: `translate(-50%, -50%) rotate(${
                  (idx * 360) / n
                }deg) translateY(-${r}px)`,
                transformOrigin: "center center",
                borderRadius: w / 2,
                background: color,
                opacity,
                boxShadow: shadow,
                transition:
                  phase === "filling"
                    ? "opacity 80ms ease, box-shadow 80ms ease"
                    : "opacity 200ms ease",
                willChange: "opacity",
              }}
            />
          );
        })}
      </span>
    </span>
  );
}
