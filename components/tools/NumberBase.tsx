"use client";

import { useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

const BASES = [
  { name: "二进制", nameEn: "Binary", radix: 2 },
  { name: "八进制", nameEn: "Octal", radix: 8 },
  { name: "十进制", nameEn: "Decimal", radix: 10 },
  { name: "十六进制", nameEn: "Hexadecimal", radix: 16 },
];

export default function NumberBase() {
  const [input, setInput] = useLocalStorage("tool-numbase-input", "");
  const [fromBase, setFromBase] = useLocalStorage("tool-numbase-from", 10);
  const [error, setError] = useState("");
  const { show: toast } = useToast();

  const parseInput = (val: string, base: number): bigint | null => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    try {
      if (base === 10) {
        const n = BigInt(trimmed);
        if (n < 0) return null;
        return n;
      }
      const clean = trimmed.replace(/[\s_]/g, "");
      if (base === 2 && /^[01]+$/i.test(clean)) return BigInt("0b" + clean);
      if (base === 8 && /^[0-7]+$/i.test(clean)) return BigInt("0o" + clean);
      if (base === 16 && /^[0-9a-f]+$/i.test(clean)) return BigInt("0x" + clean);
      return null;
    } catch {
      return null;
    }
  };

  const value = parseInput(input, fromBase);
  const results = value !== null ? BASES.map((b) => ({ ...b, value: value.toString(b.radix) })) : null;

  const handleInput = (val: string) => {
    setInput(val);
    setError("");
    if (val.trim() && parseInput(val, fromBase) === null) {
      setError("输入格式不正确，请检查");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <label className="text-sm text-[var(--color-text-dim)]">输入进制：</label>
        <select value={fromBase} onChange={(e) => { setFromBase(Number(e.target.value)); setError(""); }} className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
          {BASES.map((b) => (
            <option key={b.radix} value={b.radix}>{b.name}</option>
          ))}
        </select>
      </div>

      <div>
        <input
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={`请输入${BASES.find((b) => b.radix === fromBase)?.name}数字...`}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg font-mono text-base bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          spellCheck={false}
        />
        {error && <p className="text-[var(--color-error-text)] text-xs mt-1">{error}</p>}
      </div>

      {results && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.map((r) => (
            <div key={r.radix} className={`bg-[var(--color-card)] border rounded-lg px-4 py-3 ${r.radix === fromBase ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]" : "border-[var(--color-border)]"}`}>
              <div className="text-xs text-[var(--color-text-faint)] mb-1">{r.name} (基数 {r.radix})</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-sm text-[var(--color-text)] break-all">{r.value}</code>
                <button onClick={() => { if (copyToClipboard(r.value)) toast("已复制"); }} className="flex-shrink-0 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)] transition-colors">复制</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
