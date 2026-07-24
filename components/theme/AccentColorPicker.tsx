"use client";

import { useState } from "react";
import { Palette, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccentTheme } from "@/components/theme/ThemeProvider";
import { accentThemes } from "@/lib/themes";

export default function AccentColorPicker() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useAccentTheme();

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[100] flex h-11 w-11 items-center justify-center rounded-full border border-dark-700 bg-dark-800/80 text-dark-400 shadow-lg backdrop-blur-md transition-all hover:text-white hover:border-dark-600 hover:shadow-[0_0_15px_rgba(var(--primary-500-rgb),0.15)]"
        aria-label="Open theme settings"
      >
        <Palette size={18} />
      </button>

      {/* Side panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 z-[101] flex h-full w-80 flex-col border-l border-dark-800 bg-dark-950 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-dark-800 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="block h-4 w-4 rounded-full"
                    style={{ background: "var(--primary-500)" }}
                  />
                  <h2 className="text-sm font-semibold text-white">
                    Theme
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-dark-800 hover:text-white"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Color grid */}
              <div className="flex-1 overflow-y-auto px-5 py-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-dark-500">
                  Accent Color
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {accentThemes.map((t) => {
                    const isActive = t.name === theme.name;
                    const primary = t.colors["500"];
                    return (
                      <button
                        key={t.name}
                        onClick={() => setTheme(t.name)}
                        className="group flex flex-col items-center gap-1.5"
                        aria-label={t.label}
                        title={t.label}
                      >
                        <span
                          className="block rounded-full transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
                          style={{
                            width: 36,
                            height: 36,
                            background: primary,
                            boxShadow: isActive
                              ? `0 0 0 2px ${primary}, 0 0 0 3px rgba(255,255,255,0.15), 0 0 12px ${primary}50`
                              : "0 0 0 1px rgba(255,255,255,0.06)",
                          }}
                        >
                          {isActive && (
                            <span className="flex h-full items-center justify-center">
                              <Check size={16} className="text-white drop-shadow" />
                            </span>
                          )}
                        </span>
                        <span
                          className={`text-[10px] leading-tight text-center ${
                            isActive ? "text-white font-medium" : "text-dark-500"
                          }`}
                        >
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-dark-800 px-5 py-3">
                <p className="text-[11px] text-dark-600">
                  Saved to your browser.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
