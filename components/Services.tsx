"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Brain,
  Globe,
  Database,
  Zap,
} from "lucide-react";
import { services } from "@/data";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

const iconMap: Record<string, React.ElementType> = {
  Code2,
  Server,
  Brain,
  Globe,
  Database,
  Zap,
};

export default function Services() {
  return (
    <AnimatedSection id="services" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Services"
          subtitle="Professional development services for businesses and organizations."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group rounded-xl border border-dark-800 bg-dark-900/50 p-6 transition-all hover:border-primary-500/30 hover:shadow-[0_0_20px_rgba(var(--primary-500-rgb),0.05)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400 transition-colors group-hover:bg-primary-500/20">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-dark-400">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
