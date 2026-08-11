"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function UrlEncoder() {
  const [input, setInput] = useLocalStorage("tool-url-encoder-input", "");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useLocalStorage<"encode" | "decode">("tool-url-encoder-mode", "encode");
  const { show: toast } = useToast();
  const debouncedInput = useDebounce(input, 300);

  const convert = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput("解码失败，请检查输入");
    }
  };

  useEffect(() => {
    if (debouncedInput) convert();
    else setOutput("");
  }, [debouncedInput, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", convert);

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setMode("encode"); setOutput(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "encode" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>编码 Encode</button>
        <button onClick={() => { setMode("decode"); setOutput(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "decode" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>解码 Decode</button>
        <button onClick={convert} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">转换</button>
        {output && (
          <>
            <button onClick={swap} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] transition-colors text-[var(--color-text-dim)]">交换</button>
            <button onClick={() => { if (copyToClipboard(output)) toast("已复制到剪贴板"); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] transition-colors text-[var(--color-text-dim)]">复制结果</button>
          </>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">{mode === "encode" ? "输入文本" : "输入 URL 编码"}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" spellCheck={false} />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输出结果</label>
          <textarea value={output} readOnly className="w-full h-64 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-output)] text-[var(--color-text)] outline-none" spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
