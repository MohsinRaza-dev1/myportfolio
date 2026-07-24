import RadialLoader from "@/components/ui/RadialLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-950/80 backdrop-blur-sm">
      <RadialLoader size="large" segmentCount={14} />
    </div>
  );
}
