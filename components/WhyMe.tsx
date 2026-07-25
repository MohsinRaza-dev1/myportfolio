"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Code,
  Lightbulb,
  Target,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { whyMe } from "@/data";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Code,
  Lightbulb,
  Target,
  BookOpen,
  MessageSquare,
};

export default function WhyMe() {
  return (
    <AnimatedSection id="why-me" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Why Work With Me"
          subtitle="What sets me apart as a developer and technology partner."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {whyMe.map((item, i) => {
            const Icon = iconMap[item.icon] || Cpu;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-4 rounded-xl border border-dark-800 bg-dark-900/30 p-5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-dark-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
