interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = true }: SectionHeadingProps) {
  return (
    <div className={`mb-10 md:mb-16 ${centered ? "text-center" : ""}`}>
      <h2 className="inline-block text-2xl font-bold text-white md:text-4xl">
        {title}
        <span className="ml-1 text-primary-500">.</span>
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-dark-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
