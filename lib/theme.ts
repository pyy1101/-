"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [hydrated, setHydrated] = useState(false);

  // Read from localStorage only after hydration
  useEffect(() => {
    const stored = localStorage.getItem("devshells-theme") as Theme | null;
    if (stored) setThemeState(stored);
    setHydrated(true);
  }, []);

  const resolved: "light" | "dark" = hydrated
    ? theme === "system"
      ? getSystemPreference()
      : theme
    : "light";

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", resolved === "dark");

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        document.documentElement.classList.toggle("dark", mq.matches);
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme, resolved, hydrated]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("devshells-theme", t);
  }, []);

  return { theme, setTheme, resolved };
}
