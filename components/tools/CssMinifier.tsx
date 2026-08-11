"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function CssMinifier() {
  const [input, setInput] = useLocalStorage("tool-css-input", "");
  const [output, setOutput] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const { show: toast } = useToast();
  const debouncedInput = useDebounce(input, 400);

  const minify = () => {
    const size = new TextEncoder().encode(input).length;
    setOriginalSize(size);
    let css = input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,])\s*/g, "$1")
      .replace(/;}/g, "}")
      .replace(/^\s+|\s+$/g, "")
      .replace(/\b0(\.\d+)px\b/g, "$1px");
    setOutput(css);
  };

  useEffect(() => {
    if (debouncedInput) minify();
    else { setOutput(""); setOriginalSize(0); }
  }, [debouncedInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", minify);

  const saved = output ? Math.max(0, Math.round((1 - output.length / input.length) * 100)) : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={minify} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">压缩 CSS</button>
        {output && <button onClick={() => { if (copyToClipboard(output)) toast("已复制到剪贴板"); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">复制</button>}
        {output && <span className="text-sm text-[var(--color-text-dim)] py-2">{originalSize.toLocaleString()} bytes → {new TextEncoder().encode(output).length.toLocaleString()} bytes (减小 {saved}%)</span>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="body { margin: 0px; padding: 0px; }" spellCheck={false} />
        <textarea value={output} readOnly className="w-full h-80 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-output)] text-[var(--color-text)] outline-none" spellCheck={false} />
      </div>
    </div>
  );
}
