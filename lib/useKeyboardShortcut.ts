"use client";

import { useEffect } from "react";

interface ShortcutOptions {
  enabled?: boolean;
  ctrlOrMeta?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options: ShortcutOptions = {}
) {
  const { enabled = true, ctrlOrMeta = true } = options;

  useEffect(() => {
    if (!enabled) return;
    const fn = (e: KeyboardEvent) => {
      const mod = ctrlOrMeta ? e.ctrlKey || e.metaKey : true;
      if (e.key === key && mod && !e.repeat) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [key, handler, enabled, ctrlOrMeta]);
}
