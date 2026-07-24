interface LoadingProgressProps {
  progress: number; // 0–100
  className?: string;
}

export default function LoadingProgress({ progress, className = "" }: LoadingProgressProps) {
  const pct = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      className={className}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading progress"
      style={{
        width: "100%",
        maxWidth: 240,
        height: 3,
        borderRadius: 2,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: 2,
          background: "var(--primary-500, #3b82f6)",
          boxShadow: "0 0 8px rgba(var(--primary-500-rgb, 59, 130, 246), 0.5), 0 0 16px rgba(var(--primary-500-rgb, 59, 130, 246), 0.2)",
          transition: "width 400ms ease",
        }}
      />
    </div>
  );
}
