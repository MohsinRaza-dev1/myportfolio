"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Database, Globe, Layers } from "lucide-react";
import { profile } from "@/data";
import AnimatedSection from "@/components/AnimatedSection";

const highlights = [
  { icon: Code2, label: "Full Stack Development" },
  { icon: Cpu, label: "AI & Machine Learning" },
  { icon: Database, label: "Databases Management" },
  { icon: Globe, label: "APIs & Automation" },
];

export default function About() {
  return (
    <AnimatedSection id="about" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:gap-16 md:grid-cols-5">
          {/* Left - Main Content */}
          <div className="md:col-span-3">
            <h2 className="inline-block text-2xl font-bold text-white md:text-4xl">
              About Me<span className="ml-1 text-primary-500"></span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-dark-300">
              {profile.about}
            </p>
            <p className="mt-4 text-base leading-relaxed text-dark-400">
             
            </p>
            <p className="mt-4 text-base leading-relaxed text-dark-400">
             
            </p>

            {/* Education */}
            <div className="mt-8 rounded-xl border border-dark-800 bg-dark-900/50 p-5">
              <p className="text-sm text-dark-500">Education</p>
              <p className="mt-1 font-medium text-white">
                {profile.education}
              </p>
            </div>
          </div>

          {/* Right - Highlights */}
          <div className="md:col-span-2">
            <div className="grid gap-4">
              {highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 rounded-xl border border-dark-800 bg-dark-900/50 p-4 hover:border-primary-500/20 hover:bg-dark-900/80 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400">
                      <Icon size={20} />
                    </div>
                    <span className="font-medium text-white">{item.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
