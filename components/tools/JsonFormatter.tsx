"use client";

import { useState, useCallback, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

function parseJsonPosition(error: SyntaxError): { line: number; column: number } | null {
  const match = error.message.match(/position\s+(\d+)/i) ||
    error.message.match(/at line (\d+) column (\d+)/i) ||
    error.message.match(/line (\d+) column (\d+)/i);
  if (!match) return null;
  if (match.length === 3) return { line: Number(match[1]), column: Number(match[2]) };
  return null;
}

export default function JsonFormatter() {
  const [input, setInput] = useLocalStorage("tool-json-input", "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useLocalStorage("tool-json-indent", 2);
  const { show: toast } = useToast();
  const debouncedInput = useDebounce(input, 500);

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      const msg = (e as Error).message;
      const pos = parseJsonPosition(e as SyntaxError);
      if (pos) {
        setError(`第 ${pos.line} 行，第 ${pos.column} 列：${msg}`);
      } else {
        setError(msg);
      }
      setOutput("");
    }
  }, [input, indent]);

  const compress = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      const msg = (e as Error).message;
      const pos = parseJsonPosition(e as SyntaxError);
      if (pos) {
        setError(`第 ${pos.line} 行，第 ${pos.column} 列：${msg}`);
      } else {
        setError(msg);
      }
      setOutput("");
    }
  }, [input]);

  useEffect(() => {
    if (debouncedInput) format();
    else { setOutput(""); setError(""); }
  }, [debouncedInput, indent]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", format);

  const copyOutput = () => {
    if (copyToClipboard(output)) toast("已复制到剪贴板");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={format} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">格式化</button>
        <button onClick={compress} className="px-4 py-2 bg-[var(--color-muted)] text-[var(--color-text)] rounded-lg text-sm font-medium hover:brightness-95 transition-colors">压缩</button>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)]">
          <option value={2}>缩进 2</option>
          <option value={4}>缩进 4</option>
        </select>
        {output && (
          <button onClick={copyOutput} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] transition-colors text-[var(--color-text-dim)]">复制结果</button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输入 JSON</label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            className="w-full h-80 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder='{"hello": "world"}'
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输出结果</label>
          <textarea
            value={error ? error : output}
            readOnly
            className={`w-full h-80 p-3 border rounded-lg font-mono text-sm resize-y bg-[var(--color-output)] outline-none ${error ? "border-[var(--color-error-border)] text-[var(--color-error-text)]" : "border-[var(--color-border)] text-[var(--color-text)]"}`}
            placeholder="输入 JSON 自动格式化..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
