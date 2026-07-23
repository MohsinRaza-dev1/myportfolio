"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  fullScreen?: boolean;
  size?: number;
  text?: string;
  /** When set, controls visibility — fade-out is handled externally */
  visible?: boolean;
  /** Duration in ms before auto-hiding (only when visible is not controlled) */
  timeout?: number;
}

function SpinnerRing({ size = 160, text = "LOADING", isActive = true }: { size?: number; text?: string; isActive?: boolean }) {
  const tickCount = 24;
  const [phase, setPhase] = useState<"building" | "holding" | "clearing">("building");
  const [visibleLines, setVisibleLines] = useState(0);
  const [rotation, setRotation] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  const cycle = useCallback((timestamp: number) => {
    if (!startTime.current) startTime.current = timestamp;
    const elapsed = timestamp - startTime.current;

    // Cycle timing (ms)
    const buildPhaseMs = 2000;       // 2s to build lines one by one
    const holdPhaseMs = 500;         // 0.5s hold at full circle
    const clearPhaseMs = 400;        // 0.4s clear all

    const totalCycleMs = buildPhaseMs + holdPhaseMs + clearPhaseMs;
    const cycleProgress = elapsed % totalCycleMs;

    if (cycleProgress < buildPhaseMs) {
      // BUILDING: lines appear one by one, everything rotates
      setPhase("building");
      const progress = cycleProgress / buildPhaseMs;
      const count = Math.floor(progress * tickCount);
      setVisibleLines(Math.min(count, tickCount));
      setRotation(progress * 360);
    } else if (cycleProgress < buildPhaseMs + holdPhaseMs) {
      // HOLDING: all lines visible, completing the circle rotation
      setPhase("holding");
      setVisibleLines(tickCount);
      const holdProgress = (cycleProgress - buildPhaseMs) / holdPhaseMs;
      setRotation(360 + holdProgress * 90); // rotate a bit more during hold
    } else {
      // CLEARING: all lines vanish at once
      setPhase("clearing");
      setVisibleLines(0);
      setRotation(450); // final rotation position
    }

    rafId.current = requestAnimationFrame(cycle);
  }, [tickCount]);

  useEffect(() => {
    if (!isActive) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      setVisibleLines(0);
      setRotation(0);
      startTime.current = null;
      return;
    }

    startTime.current = null;
    rafId.current = requestAnimationFrame(cycle);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isActive, cycle]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Rotating circle of splitting lines */}
      <div
        className="absolute inset-0"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: phase === "clearing" ? "opacity 0.3s ease-out" : "none",
          opacity: phase === "clearing" ? 0 : 1,
        }}
      >
        {Array.from({ length: tickCount }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: 1.5,
              height: "40%",
              transform: `translate(-50%, -50%) rotate(${(i * 360) / tickCount}deg) translateY(-50%)`,
              transformOrigin: "center center",
              opacity: i < visibleLines ? 1 : 0,
              transition: "opacity 0.15s ease-out",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "35%",
                background: "#0088ff",
                borderRadius: 1,
                boxShadow: "0 0 6px rgba(0, 136, 255, 0.6), 0 0 12px rgba(0, 136, 255, 0.2)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Outer glow ring behind the lines */}
      <div
        className="absolute rounded-full"
        style={{
          width: "96%",
          height: "96%",
          border: "1px solid rgba(0, 136, 255, 0.08)",
          boxShadow: "0 0 30px rgba(0, 136, 255, 0.06), inset 0 0 30px rgba(0, 136, 255, 0.03)",
          opacity: phase === "clearing" ? 0 : 1,
          transition: "opacity 0.3s ease-out",
        }}
      />

      {/* LOADING text */}
      <motion.span
        className="z-10 text-center text-sm font-bold uppercase tracking-[0.25em]"
        style={{ color: "#60a5fa" }}
        animate={{
          opacity: isActive ? [0.7, 1, 0.7] : 0,
          textShadow: isActive
            ? [
                "0 0 8px rgba(59,130,246,0.3)",
                "0 0 16px rgba(59,130,246,0.7), 0 0 30px rgba(59,130,246,0.3)",
                "0 0 8px rgba(59,130,246,0.3)",
              ]
            : "0 0 0px transparent",
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}

export default function Loader({
  fullScreen = true,
  size,
  text = "LOADING",
  visible,
  timeout = 5000,
}: LoaderProps) {
  const [internalVisible, setInternalVisible] = useState(true);

  useEffect(() => {
    if (visible === undefined && timeout) {
      const timer = setTimeout(() => setInternalVisible(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [visible, timeout]);

  const isVisible = visible ?? internalVisible;

  const spinner = <SpinnerRing size={size} text={text} isActive={isVisible} />;

  if (!fullScreen) {
    return isVisible ? spinner : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {spinner}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
