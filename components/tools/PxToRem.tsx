"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function PxToRem() {
  const [px, setPx] = useLocalStorage("tool-px-rem-px", "16");
  const [rem, setRem] = useLocalStorage("tool-px-rem-rem", "");
  const [base, setBase] = useLocalStorage("tool-px-rem-base", 16);
  const { show: toast } = useToast();
  const debouncedPx = useDebounce(px, 300);
  const debouncedRem = useDebounce(rem, 300);

  useEffect(() => {
    if (debouncedPx) {
      const v = Number(debouncedPx) / base;
      let formatted: string;
      if (v === 0) formatted = "0";
      else formatted = v.toFixed(3).replace(/\.?0+$/, "") || "0";
      setRem(formatted);
    }
  }, [debouncedPx, base]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (debouncedRem) {
      const v = Number(debouncedRem) * base;
      setPx(String(v % 1 === 0 ? v : v.toFixed(2)));
    }
  }, [debouncedRem, base]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", () => {});

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">根字体大小 (root font-size)</label>
        <input type="number" min={1} max={100} value={base} onChange={(e) => setBase(Number(e.target.value) || 16)} className="w-24 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)]" />
        <span className="text-sm text-[var(--color-text-dim)] ml-2">px（默认 16px）</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-5">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">PX → REM</label>
          <div className="flex gap-2">
            <input type="text" value={px} onChange={(e) => setPx(e.target.value)} className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg font-mono text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="16" />
            <span className="text-sm text-[var(--color-text-dim)] py-2">px</span>
          </div>
          {rem && (
            <div className="mt-3 p-3 bg-[var(--color-success)] border border-[var(--color-success-border)] rounded-lg font-mono text-sm text-[var(--color-success-text)] flex items-center justify-between">
              <span>{rem} rem</span>
              <button onClick={() => { if (copyToClipboard(rem + "rem")) toast("已复制"); }} className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">复制</button>
            </div>
          )}
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-5">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">REM → PX</label>
          <div className="flex gap-2">
            <input type="text" value={rem} onChange={(e) => setRem(e.target.value)} className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg font-mono text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="1" />
            <span className="text-sm text-[var(--color-text-dim)] py-2">rem</span>
          </div>
        </div>
      </div>
    </div>
  );
}
