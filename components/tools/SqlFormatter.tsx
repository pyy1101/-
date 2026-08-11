"use client";

import { useState, useEffect } from "react";
import { format } from "sql-formatter";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function SqlFormatter() {
  const [input, setInput] = useLocalStorage("tool-sql-input", "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useLocalStorage<"format" | "compress">("tool-sql-mode", "format");
  const { show: toast } = useToast();
  const debouncedInput = useDebounce(input, 400);

  const process = () => {
    setError("");
    if (!debouncedInput.trim()) { setOutput(""); return; }
    try {
      if (mode === "compress") {
        setOutput(debouncedInput.replace(/\s+/g, " ").replace(/\s*;\s*/g, ";").trim());
      } else {
        const f = format(debouncedInput, {
          language: "sql",
          tabWidth: 2,
          keywordCase: "upper",
          linesBetweenQueries: 2,
        });
        setOutput(f);
      }
    } catch (e) {
      setError((e as Error).message || "处理失败，请检查 SQL 语法");
      setOutput("");
    }
  };

  useEffect(() => { process(); }, [debouncedInput, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", process);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setMode("format")} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "format" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>格式化</button>
        <button onClick={() => setMode("compress")} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "compress" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>压缩</button>
        <button onClick={process} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">执行</button>
        {output && (
          <button onClick={() => { if (copyToClipboard(output)) toast("已复制到剪贴板"); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">复制结果</button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输入 SQL</label>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} className="w-full h-80 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" spellCheck={false} placeholder="SELECT * FROM users WHERE id = 1" />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输出结果</label>
          <textarea value={error || output} readOnly className={`w-full h-80 p-3 border rounded-lg font-mono text-sm resize-y bg-[var(--color-output)] outline-none ${error ? "border-[var(--color-error-border)] text-[var(--color-error-text)]" : "border-[var(--color-border)] text-[var(--color-text)]"}`} spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
