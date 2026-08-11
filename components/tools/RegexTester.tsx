"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";

export default function RegexTester() {
  const [pattern, setPattern] = useLocalStorage("tool-regex-pattern", "");
  const [flags, setFlags] = useLocalStorage("tool-regex-flags", "g");
  const [text, setText] = useLocalStorage("tool-regex-text", "");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");
  const debouncedPattern = useDebounce(pattern, 300);
  const debouncedText = useDebounce(text, 300);

  const test = () => {
    setError("");
    setMatches([]);
    if (!pattern) return;
    try {
      const re = new RegExp(pattern, flags);
      const result = [...text.matchAll(re)];
      setMatches(result.map((m) => m[0]));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => { test(); }, [debouncedPattern, debouncedText, flags]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", test);

  const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const highlight = () => {
    if (!pattern || !text) return escapeHtml(text);
    try {
      const re = new RegExp(pattern, flags);
      return text.replace(re, (match) => `<mark class="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">${escapeHtml(match)}</mark>`);
    } catch {
      return escapeHtml(text);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">正则表达式</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[var(--color-border)] bg-[var(--color-output)] text-[var(--color-text-dim)] font-mono text-sm">/</span>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className="flex-1 px-3 py-2 border-y border-[var(--color-border)] font-mono text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-inset" placeholder="\\d+" />
            <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-[var(--color-border)] bg-[var(--color-output)] text-[var(--color-text-dim)] font-mono text-sm">/</span>
          </div>
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">标志</label>
          <select value={flags} onChange={(e) => setFlags(e.target.value)} className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)] font-mono">
            <option value="g">g</option>
            <option value="gi">gi</option>
            <option value="gm">gm</option>
            <option value="gim">gim</option>
            <option value="gs">gs</option>
            <option value="giu">giu</option>
          </select>
        </div>
        <button onClick={test} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">测试</button>
      </div>

      <div>
        <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">测试文本</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-40 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="输入测试文本..." spellCheck={false} />
      </div>

      {error && <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg p-3 text-sm text-[var(--color-error-text)]">{error}</div>}

      {matches.length > 0 && (
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">匹配结果 ({matches.length})</label>
          <div className="bg-[var(--color-success)] border border-[var(--color-success-border)] rounded-lg p-4 max-h-60 overflow-y-auto space-y-1">
            {matches.map((m, i) => (
              <div key={i} className="font-mono text-sm text-[var(--color-success-text)]">[{i + 1}] &quot;{m}&quot;</div>
            ))}
          </div>
        </div>
      )}

      {pattern && text && (
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">高亮预览</label>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 text-sm leading-relaxed break-all" dangerouslySetInnerHTML={{ __html: highlight() }} />
        </div>
      )}
    </div>
  );
}
