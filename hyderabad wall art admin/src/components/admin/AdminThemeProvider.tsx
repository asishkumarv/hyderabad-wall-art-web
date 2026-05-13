import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ThemeMode = "light" | "dark";
const STORAGE_KEY = "hwa-theme-mode";
const ThemeContext = createContext<{ theme: ThemeMode; toggleTheme: () => void } | null>(null);

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [flashKey, setFlashKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => {
      setFlashKey((value) => value + 1);
      setTheme((current) => current === "dark" ? "light" : "dark");
    },
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {!prefersReducedMotion && (
          <motion.div
            key={flashKey}
            initial={{ opacity: 0.28 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="pointer-events-none fixed inset-0 z-[120] bg-background"
          />
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeMode must be used within AdminThemeProvider");
  return context;
}
