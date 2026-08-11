"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function TextDedup() {
  const [input, setInput] = useLocalStorage("tool-dedup-input", "");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useLocalStorage<"keep-first" | "keep-last" | "unique">("tool-dedup-mode", "keep-first");
  const [stats, setStats] = useState<{ original: number; unique: number; removed: number } | null>(null);
  const { show: toast } = useToast();
  const debouncedInput = useDebounce(input, 400);

  const process = useCallback(() => {
    const lines = input.split("\n");
    const original = lines.length;
    let result: string[];
    if (mode === "keep-first") {
      const seen = new Set<string>();
      result = lines.filter((line) => { if (seen.has(line)) return false; seen.add(line); return true; });
    } else if (mode === "keep-last") {
      const seen = new Set<string>();
      result = [];
      for (let i = lines.length - 1; i >= 0; i--) {
        if (!seen.has(lines[i])) { result.unshift(lines[i]); seen.add(lines[i]); }
      }
    } else {
      const counts = new Map<string, number>();
      for (const line of lines) counts.set(line, (counts.get(line) || 0) + 1);
      result = lines.filter((line) => counts.get(line) === 1);
    }
    setOutput(result.join("\n"));
    setStats({ original, unique: result.length, removed: original - result.length });
  }, [input, mode]);

  useEffect(() => { if (debouncedInput) process(); else { setOutput(""); setStats(null); } }, [debouncedInput, mode, process]);

  useKeyboardShortcut("Enter", process);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <label className="text-sm text-[var(--color-text-dim)]">去重模式：</label>
        {(["keep-first", "keep-last", "unique"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${mode === m ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>
            {m === "keep-first" ? "保留第一项" : m === "keep-last" ? "保留最后一项" : "仅保留唯一项"}
          </button>
        ))}
        <button onClick={process} disabled={!input.trim()} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 ml-auto">去重</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输入文本（每行一项）{input && <span className="text-[var(--color-text-faint)] ml-2">{input.split("\n").length} 行</span>}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" spellCheck={false} placeholder="每行一个值，重复行将被移除..." />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输出结果{stats && <span className="text-[var(--color-accent)] ml-2">移除 {stats.removed} 项，剩余 {stats.unique} 项</span>}</label>
          <textarea value={output} readOnly className="w-full h-80 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-output)] text-[var(--color-text)] outline-none" spellCheck={false} />
        </div>
      </div>

      {stats && stats.removed === 0 && <p className="text-sm text-[var(--color-text-faint)] text-center">没有发现重复项</p>}

      {output && (
        <div className="flex gap-2">
          <button onClick={() => { if (copyToClipboard(output)) toast("已复制到剪贴板"); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">复制结果</button>
          <button onClick={() => { setInput(""); setOutput(""); setStats(null); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">清空</button>
        </div>
      )}
    </div>
  );
}
