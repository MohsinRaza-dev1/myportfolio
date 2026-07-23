interface ButtonLoaderProps {
  size?: number;
}

export default function ButtonLoader({ size = 20 }: ButtonLoaderProps) {
  const tickCount = 12;

  return (
    <span
      className="inline-block align-middle"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="relative block h-full w-full"
        style={{ animation: "spin 1s linear infinite" }}
      >
        {Array.from({ length: tickCount }).map((_, i) => {
          const angle = (i * 360) / tickCount;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: 1.5,
                height: "100%",
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-50%)`,
                transformOrigin: "center center",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "100%",
                  height: "30%",
                  background: "#0088ff",
                  borderRadius: 1,
                  boxShadow: "0 0 4px rgba(0, 136, 255, 0.6), 0 0 8px rgba(0, 136, 255, 0.2)",
                }}
              />
            </span>
          );
        })}
      </span>
    </span>
  );
}
