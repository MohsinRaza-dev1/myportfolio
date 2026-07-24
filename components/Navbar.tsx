"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data";
import { scrollToSection } from "@/lib/utils";
import { cn } from "@/lib/utils";
import RadialLoader from "@/components/ui/RadialLoader";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [navigating, setNavigating] = useState(""); // section id being navigated to

  // Lock body scroll when mobile menu is open — uses position:fixed instead of
  // overflow:hidden alone, which doesn't prevent background scroll on iOS Safari.
  useEffect(() => {
    if (isMobileOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (top) {
        window.scrollTo(0, parseInt(top.replace("px", "") || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navItems.map((item) => item.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    const sectionId = href.slice(1);
    setIsMobileOpen(false);
    setNavigating(sectionId);
    // Short delay to let the loader appear before scrolling
    setTimeout(() => {
      scrollToSection(sectionId);
      // Keep navigating true long enough for the radial loader to show
      setTimeout(() => setNavigating(""), 1000);
    }, 400);
  };

  return (
    <>
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-dark-800/50 bg-dark-950/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          onClick={() => handleNav("#home")}
          className="text-xl font-bold text-white"
        >
          <span className="text-primary-500"></span>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => handleNav(item.href)}
                className={cn(
                  "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  activeSection === item.href.slice(1)
                    ? "text-primary-400"
                    : "text-dark-400 hover:text-white"
                )}
              >
                {item.label}
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary-500/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <button
          onClick={() => handleNav("#contact")}
          className="hidden rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-primary-500 md:block"
        >
          Let&apos;s Connect
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="relative z-50 rounded-lg p-2 text-dark-400 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-dark-950/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-2">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNav(item.href)}
                  className={cn(
                    "text-2xl font-medium transition-colors",
                    activeSection === item.href.slice(1)
                      ? "text-primary-400"
                      : "text-dark-400 hover:text-white"
                  )}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => handleNav("#contact")}
                className="mt-8 rounded-lg bg-primary-600 px-8 py-3 text-lg font-medium text-white transition-all hover:bg-primary-500"
              >
                Let&apos;s Connect
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>

      {/* Navigation Loader - subtle overlay with radial loader */}
      <AnimatePresence>
        {navigating && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RadialLoader size="medium" segmentCount={14} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
