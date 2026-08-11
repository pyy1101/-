"use client";

import { useState, useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

function generateUUIDv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>(() => [generateUUIDv4()]);
  const [count, setCount] = useLocalStorage("tool-uuid-count", 5);
  const [uppercase, setUppercase] = useLocalStorage("tool-uuid-upper", false);
  const { show: toast } = useToast();

  const generate = useCallback(() => {
    const list = Array.from({ length: Math.min(50, Math.max(1, count)) }, () => generateUUIDv4());
    setUuids(list);
  }, [count]);

  const display = (uuid: string) => (uppercase ? uuid.toUpperCase() : uuid.toLowerCase());

  const copyAll = () => {
    if (copyToClipboard(uuids.map(display).join("\n"))) toast("已复制全部 UUID");
  };

  const copyOne = (uuid: string) => {
    if (copyToClipboard(display(uuid))) toast("已复制");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <label className="text-sm text-[var(--color-text-dim)]">生成数量：</label>
        <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))} className="w-20 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
        <button onClick={generate} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">生成</button>
        <label className="flex items-center gap-1 text-sm text-[var(--color-text-dim)] ml-2">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded" />
          大写
        </label>
        {uuids.length > 0 && (
          <button onClick={copyAll} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)] ml-auto">复制全部</button>
        )}
      </div>

      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center gap-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg px-4 py-3 group hover:border-[var(--color-accent)] transition-colors">
            <span className="text-xs text-[var(--color-text-faint)] font-mono w-6">{i + 1}.</span>
            <code className="flex-1 font-mono text-sm text-[var(--color-text)] break-all">{display(uuid)}</code>
            <button onClick={() => copyOne(uuid)} className="flex-shrink-0 px-3 py-1 text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] rounded transition-colors opacity-0 group-hover:opacity-100">
              复制
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
