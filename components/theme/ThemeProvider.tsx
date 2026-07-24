"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  findTheme,
  getSavedThemeName,
  saveThemeName,
  applyThemeToDocument,
  defaultThemeName,
  type AccentTheme,
} from "@/lib/themes";

interface ThemeContextValue {
  theme: AccentTheme;
  setTheme: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: findTheme(defaultThemeName),
  setTheme: () => {},
});

export function useAccentTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AccentTheme>(() => findTheme(getSavedThemeName()));

  const setTheme = useCallback((name: string) => {
    const t = findTheme(name);
    setThemeState(t);
    saveThemeName(name);
    applyThemeToDocument(t);
  }, []);

  // Apply the saved theme on mount
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
