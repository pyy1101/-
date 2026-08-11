"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function Base64Tool() {
  const [input, setInput] = useLocalStorage("tool-base64-input", "");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useLocalStorage<"encode" | "decode">("tool-base64-mode", "encode");
  const [error, setError] = useState("");
  const { show: toast } = useToast();
  const debouncedInput = useDebounce(input, 300);

  const convert = () => {
    setError("");
    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        setOutput(btoa(binary));
      } else {
        const binary = atob(input);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch {
      setError(mode === "decode" ? "Base64 解码失败，请检查输入" : "编码失败");
      setOutput("");
    }
  };

  useEffect(() => {
    if (debouncedInput) convert();
    else { setOutput(""); setError(""); }
  }, [debouncedInput, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", convert);

  const swap = () => {
    setInput(output);
    setOutput("");
    setError("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setMode("encode"); setOutput(""); setError(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "encode" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>编码 Encode</button>
        <button onClick={() => { setMode("decode"); setOutput(""); setError(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "decode" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>解码 Decode</button>
        <button onClick={convert} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">转换</button>
        {output && (
          <>
            <button onClick={swap} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] transition-colors text-[var(--color-text-dim)]">交换</button>
            <button onClick={() => { if (copyToClipboard(output)) toast("已复制到剪贴板"); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] transition-colors text-[var(--color-text-dim)]">复制结果</button>
          </>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">{mode === "encode" ? "输入文本" : "输入 Base64"}</label>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} className="w-full h-64 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" spellCheck={false} />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输出结果</label>
          <textarea value={error || output} readOnly className={`w-full h-64 p-3 border rounded-lg font-mono text-sm resize-y bg-[var(--color-output)] outline-none ${error ? "border-[var(--color-error-border)] text-[var(--color-error-text)]" : "border-[var(--color-border)] text-[var(--color-text)]"}`} spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
