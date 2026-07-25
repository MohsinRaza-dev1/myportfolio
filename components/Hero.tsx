"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Download } from "lucide-react";
import { profile as staticProfile } from "@/data";
import { scrollToSection } from "@/lib/utils";
import SocialLinks from "@/components/ui/SocialLinks";
import RadialLoader from "@/components/ui/RadialLoader";
import dynamic from "next/dynamic";

const OrbitalSystem = dynamic(
  () => import("@/components/hero/OrbitalSystem"),
  { ssr: false }
);

export default function Hero() {
  const [profile, setProfile] = useState(staticProfile);
  const [viewingResume, setViewingResume] = useState(false);
  const [downloadingCv, setDownloadingCv] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (data?.profile) setProfile(data.profile);
      })
      .catch(() => {}); // fall back to static profile
  }, []);

  const handleViewResume = useCallback(() => {
    setViewingResume(true);
    setTimeout(() => {
      window.open(profile.resumePath, "_blank", "noopener,noreferrer");
      setViewingResume(false);
    }, 800);
  }, []);

  const handleDownloadCv = useCallback(() => {
    setDownloadingCv(true);
    // Let the loader show for a moment before the download starts naturally
    // The browser handles the download — we restore state after a short delay
    setTimeout(() => setDownloadingCv(false), 1200);
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-gradient-radial" />

      {/* Glow Orbs */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-primary-500/3 blur-[100px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-20 pb-16 md:flex-row md:gap-16">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          {/* Profile Image - Circular, above heading */}
          <motion.div
            className="mb-6 flex justify-center md:justify-start"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-2xl" />
              {/* Circular image */}
              <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-primary-500/30 md:h-52 md:w-52">
                <Image
                  src={profile.profileImage}
                  alt={profile.name}
                  width={208}
                  height={208}
                  className="h-full w-full object-cover object-top"
                  priority
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-400">
              {profile.shortTitle || "Software Engineer &amp; AI Developer"}
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hi, I&apos;m {profile.name.split(" ")[0]}{" "}
            <span className="text-gradient">{profile.name.split(" ")[1]}</span>
          </motion.h1>

          <motion.p
            className="mt-2 text-xl font-semibold text-white md:text-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            className="mt-4 max-w-xl text-sm leading-relaxed text-dark-400 md:text-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {profile.description}
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3 justify-center md:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => scrollToSection("projects")}
              className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-all hover:bg-primary-500 hover:shadow-[0_0_20px_rgba(var(--primary-500-rgb),0.3)]"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="rounded-lg border border-dark-700 px-6 py-3 font-medium text-dark-300 transition-all hover:border-primary-500/50 hover:text-white"
            >
              Let&apos;s Work Together
            </button>
            <button
              onClick={() => handleViewResume()}
              disabled={viewingResume}
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-dark-400 transition-colors hover:text-primary-400 disabled:opacity-60"
            >
              {viewingResume ? (
                <RadialLoader size="small" />
              ) : (
                <FileText size={16} />
              )}
              {viewingResume ? "Opening..." : "View Resume"}
            </button>
            <a
              href={profile.resumePath}
              download
              onClick={(e) => {
                // Only show loader state for simulated delay, let native download proceed
                if (!downloadingCv) {
                  handleDownloadCv();
                }
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                downloadingCv
                  ? "text-primary-400 pointer-events-none"
                  : "text-dark-400 hover:text-primary-400"
              }`}
            >
              {downloadingCv ? (
                <RadialLoader size="small" />
              ) : (
                <Download size={16} />
              )}
              {downloadingCv ? "Preparing..." : "Download Resume"}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <SocialLinks className="mt-6 justify-center md:justify-start" />
          </motion.div>
        </div>

        {/* Right side - 3D Orbital System */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative h-[200px] w-full md:h-[450px]">
            {/* Glow behind scene */}
            <div className="absolute -inset-10 rounded-full bg-primary-500/10 blur-[100px]" />
            <div className="absolute -inset-20 rounded-full bg-primary-500/5 blur-[120px]" />
            <OrbitalSystem
              electronCount={8}
              rotationSpeed={0.8}
              orbitalCount={4}
              particleDensity={1}
              enableMouseInteraction={true}
            />
          </div>
        </motion.div>
      </div>
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-dark-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => scrollToSection("about")}
        aria-label="Scroll down"
      >
        <ArrowDown size={20} />
      </motion.button>
    </section>
  );
}
