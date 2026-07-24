"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RadialLoader from "@/components/ui/RadialLoader";
import LoadingDots from "@/components/ui/LoadingDots";
import LoadingProgress from "@/components/ui/LoadingProgress";

export default function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const finish = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
    }, 500);
  }, []);

  // Smooth progress animation over ~5.5s
  useEffect(() => {
    const duration = 500; // ms

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out for smooth feel
      const eased = 1 - Math.pow(1 - t, 2.5);
      setProgress(eased * 100);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        finish();
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ overscrollBehavior: "none" }}
        >
          <span className="sr-only">Loading website content</span>

          {/* Radial loader */}
          <RadialLoader size="large" segmentCount={14} />

          {/* Loading text with animated dots */}
          <p
            className="mt-8 text-sm font-medium tracking-[0.2em] text-primary-400/80 uppercase"
            aria-hidden="true"
          >
            Loading
            <LoadingDots />
          </p>

          {/* Progress line */}
          <LoadingProgress progress={progress} className="mt-6" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
