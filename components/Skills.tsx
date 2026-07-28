"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "@/lib/content-context";
import type { SkillCategory } from "@/types";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

const categoryIcons: Record<string, string> = {
  Backend: "⚙️",
  Frontend: "🎨",
  "AI & Machine Learning": "🤖",
  Databases: "🗄️",
  Tools: "🛠️",
};

export default function Skills() {
  const { content } = useContent();
  const skills = content.skills;
  const skillCategories = content.skillCategories;
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("Backend");

  const filteredSkills = skills.filter((s) => s.category === activeCategory);

  return (
    <AnimatedSection id="skills" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="The tools and technologies I work with to build intelligent solutions."
        />

        {/* Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {skillCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary-500/15 text-primary-400 border border-primary-500/30"
                  : "text-dark-400 border border-dark-800 hover:border-dark-700 hover:text-dark-300"
              }`}
            >
              <span className="mr-1.5">{categoryIcons[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            >
              {filteredSkills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: i * 0.03 },
                  }}
                  className="group rounded-xl border border-dark-800 bg-dark-900/50 p-4 text-center transition-all hover:border-primary-500/30 hover:bg-dark-900 hover:shadow-[0_0_15px_rgba(var(--primary-500-rgb),0.05)]"
                >
                  <span className="text-sm font-medium text-dark-300 transition-colors group-hover:text-white">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AnimatedSection>
  );
}
