"use client";

import { experiences } from "@/data";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Experience() {
  return (
    <AnimatedSection id="experience" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey in software engineering and AI development."
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Timeline Line */}
          <div className="absolute left-[19px] top-0 h-full w-px bg-dark-800" />

          <div className="space-y-12">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-14">
                {/* Timeline Dot */}
                <div className="absolute left-[11px] top-1 h-4 w-4 rounded-full border-2 border-primary-500 bg-dark-950" />

                {/* Content */}
                <div className="rounded-xl border border-dark-800 bg-dark-900/50 p-6 transition-colors hover:border-primary-500/20">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {exp.role}
                      </h3>
                      <p className="mt-1 text-primary-400">{exp.organization}</p>
                    </div>
                    {exp.period && (
                      <span className="rounded-full border border-dark-700 bg-dark-800/50 px-3 py-1 text-xs text-dark-400">
                        {exp.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-dark-400">
                    {exp.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {exp.responsibilities.map((r, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-dark-400">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
