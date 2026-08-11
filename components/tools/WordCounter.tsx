"use client";

import { useMemo } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

export default function WordCounter() {
  const [text, setText] = useLocalStorage("tool-wordcount-text", "");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const paragraphs = text ? text.split(/\n+/).filter((p) => p.trim()).length : 0;
    const bytes = new TextEncoder().encode(text).length;
    const chineseChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
    return { chars, charsNoSpaces, words, lines, paragraphs, bytes, chineseChars };
  }, [text]);

  const statItems = [
    { label: "总字符数", value: stats.chars },
    { label: "字符（无空格）", value: stats.charsNoSpaces },
    { label: "单词数", value: stats.words },
    { label: "中文字符数", value: stats.chineseChars },
    { label: "行数", value: stats.lines },
    { label: "段落数", value: stats.paragraphs },
    { label: "字节数", value: stats.bytes },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
        {statItems.map((item) => (
          <div key={item.label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[var(--color-accent)]">{item.value}</div>
            <div className="text-xs text-[var(--color-text-dim)] mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-80 p-4 border border-[var(--color-border)] rounded-lg text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        placeholder="输入或粘贴文字，实时统计..."
        spellCheck={false}
      />
    </div>
  );
}
