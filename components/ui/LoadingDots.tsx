"use client";

import { useState, useEffect, useRef } from "react";

interface LoadingDotsProps {
  className?: string;
}

export default function LoadingDots({ className = "" }: LoadingDotsProps) {
  const [dotCount, setDotCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Show first dot immediately, then cycle
    setDotCount(1);
    intervalRef.current = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span className={className} aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          style={{
            opacity: i < dotCount ? 1 : 0,
            transition: "opacity 200ms ease",
          }}
        >
          .
        </span>
      ))}
    </span>
  );
}
