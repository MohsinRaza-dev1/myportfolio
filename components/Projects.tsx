"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronDown } from "lucide-react";
import { projects } from "@/data";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <AnimatedSection id="projects" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Featured Projects"
          subtitle="Real-world applications I have built using modern technologies and AI."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group flex flex-col rounded-xl border border-dark-800 bg-dark-900/50 transition-all hover:border-primary-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.05)]"
            >
              {/* Header */}
              <div className="p-6 pb-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {project.name}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-dark-400">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 px-6 pt-4">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-dark-800 px-2 py-0.5 text-[11px] text-dark-400"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="rounded-md bg-dark-800 px-2 py-0.5 text-[11px] text-dark-500">
                    +{project.technologies.length - 5}
                  </span>
                )}
              </div>

              {/* Expandable Features */}
              <AnimatePresence>
                {expandedId === project.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-6"
                  >
                    <div className="border-t border-dark-800 pt-4 pb-2">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-dark-500">
                        Key Features
                      </p>
                      <ul className="space-y-1.5">
                        {project.features.map((f, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-xs text-dark-400"
                          >
                            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="mt-auto flex items-center gap-3 border-t border-dark-800 p-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-dark-800 px-3 py-1.5 text-xs font-medium text-dark-300 transition-colors hover:bg-dark-700 hover:text-white"
                  >
                    <Github size={14} />
                    Code
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-primary-600/10 px-3 py-1.5 text-xs font-medium text-primary-400 transition-colors hover:bg-primary-600/20"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-dark-500 transition-colors hover:text-dark-300"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      expandedId === project.id ? "rotate-180" : ""
                    }`}
                  />
                  {expandedId === project.id ? "Less" : "Details"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
