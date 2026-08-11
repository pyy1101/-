"use client";

import { useLocalStorage } from "@/lib/useLocalStorage";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

const OPERATIONS = [
  { key: "upper", label: "大写", enLabel: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { key: "lower", label: "小写", enLabel: "lowercase", fn: (s: string) => s.toLowerCase() },
  { key: "title", label: "首字母大写", enLabel: "Title Case", fn: (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase()) },
  { key: "sentence", label: "句首大写", enLabel: "Sentence case", fn: (s: string) => s.replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()) },
  { key: "camel", label: "驼峰命名", enLabel: "camelCase", fn: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_: string, c: string) => c.toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase()) },
  { key: "pascal", label: "帕斯卡命名", enLabel: "PascalCase", fn: (s: string) => s.toLowerCase().replace(/(^|[^a-z0-9]+)(.)/g, (_: string, __: string, c: string) => c.toUpperCase()) },
  { key: "snake", label: "蛇形命名", enLabel: "snake_case", fn: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") },
  { key: "kebab", label: "短横命名", enLabel: "kebab-case", fn: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") },
];

export default function CaseConverter() {
  const [input, setInput] = useLocalStorage("tool-case-input", "");
  const { show: toast } = useToast();

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="在此输入文本..."
        className="w-full h-32 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        spellCheck={false}
      />

      {input.trim() && (
        <div className="space-y-3">
          {OPERATIONS.map((op) => (
            <div key={op.key} className="flex items-center gap-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg px-4 py-3 group hover:border-[var(--color-accent)] transition-colors">
              <div className="w-28 flex-shrink-0">
                <div className="text-sm font-medium text-[var(--color-text)]">{op.label}</div>
                <div className="text-xs text-[var(--color-text-faint)]">{op.enLabel}</div>
              </div>
              <code className="flex-1 font-mono text-sm text-[var(--color-text)] break-all">{op.fn(input)}</code>
              <button onClick={() => { if (copyToClipboard(op.fn(input))) toast("已复制"); }} className="flex-shrink-0 px-3 py-1 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] rounded transition-colors opacity-0 group-hover:opacity-100">
                复制
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
