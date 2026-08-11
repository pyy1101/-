"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

const entities: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  "`": "&#96;", "¢": "&cent;", "£": "&pound;", "¥": "&yen;", "€": "&euro;",
  "©": "&copy;", "®": "&reg;", "™": "&trade;",
};

export default function HtmlEntity() {
  const [input, setInput] = useLocalStorage("tool-html-entity-input", "");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useLocalStorage<"encode" | "decode">("tool-html-entity-mode", "encode");
  const { show: toast } = useToast();
  const debouncedInput = useDebounce(input, 300);

  const convert = () => {
    if (mode === "encode") {
      setOutput(input.replace(/[&<>"'`¢£¥€©®™]/g, (c) => entities[c] || c));
    } else {
      const reversed: Record<string, string> = {};
      for (const [k, v] of Object.entries(entities)) reversed[v] = k;
      const all = Object.keys(reversed).sort((a, b) => b.length - a.length);
      let result = input;
      for (const entity of all) {
        result = result.split(entity).join(reversed[entity]);
      }
      result = result.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
      result = result.replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
      setOutput(result);
    }
  };

  useEffect(() => {
    if (debouncedInput) convert();
    else setOutput("");
  }, [debouncedInput, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", convert);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setMode("encode"); setOutput(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "encode" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>编码</button>
        <button onClick={() => { setMode("decode"); setOutput(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "decode" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>解码</button>
        <button onClick={convert} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">转换</button>
        {output && <button onClick={() => { if (copyToClipboard(output)) toast("已复制到剪贴板"); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">复制</button>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder={mode === "encode" ? '<div class="hello">World</div>' : '&lt;div class=&quot;hello&quot;&gt;World&lt;/div&gt;'} spellCheck={false} />
        <textarea value={output} readOnly className="w-full h-64 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-output)] text-[var(--color-text)] outline-none" spellCheck={false} />
      </div>
    </div>
  );
}
