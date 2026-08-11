"use client";

import { useState, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (val: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored) as T;
    } catch {
      // corrupted data, fall through
    }
    return defaultValue;
  });

  const set = useCallback(
    (val: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof val === "function" ? (val as (prev: T) => T)(prev) : val;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // storage full or unavailable
        }
        return next;
      });
    },
    [key]
  );

  return [value, set];
}
