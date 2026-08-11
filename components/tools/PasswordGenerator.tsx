"use client";

import { useState, useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

const CHARS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function PasswordGenerator() {
  const [length, setLength] = useLocalStorage("tool-pwd-length", 16);
  const [options, setOptions] = useLocalStorage("tool-pwd-options", {
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const { show: toast } = useToast();

  const generate = useCallback(() => {
    const pool = Object.entries(options)
      .filter(([, v]) => v)
      .map(([k]) => CHARS[k as keyof typeof CHARS])
      .join("");
    if (!pool) return;
    let result = "";
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) {
      result += pool[arr[i] % pool.length];
    }
    setPassword(result);
  }, [length, options]);

  const copy = () => {
    if (copyToClipboard(password)) toast("已复制到剪贴板");
  };

  const toggle = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const strength = (): { label: string; color: string; width: string } => {
    const count = Object.values(options).filter(Boolean).length;
    if (length >= 16 && count === 4) return { label: "极强", color: "bg-green-500", width: "100%" };
    if (length >= 12 && count >= 3) return { label: "强", color: "bg-green-400", width: "75%" };
    if (length >= 8 && count >= 2) return { label: "中", color: "bg-yellow-400", width: "50%" };
    return { label: "弱", color: "bg-red-400", width: "25%" };
  };

  const s = strength();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm text-[var(--color-text-dim)]">长度：</label>
        <input type="number" min={4} max={128} value={length} onChange={(e) => setLength(Math.min(128, Math.max(4, Number(e.target.value) || 4)))} className="w-20 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
      </div>

      <div className="flex flex-wrap gap-4">
        {(["lowercase", "uppercase", "numbers", "symbols"] as const).map((k) => (
          <label key={k} className="flex items-center gap-1 text-sm text-[var(--color-text)]">
            <input type="checkbox" checked={options[k]} onChange={() => toggle(k)} className="rounded" />
            {k === "lowercase" ? "小写字母" : k === "uppercase" ? "大写字母" : k === "numbers" ? "数字" : "特殊符号"}
          </label>
        ))}
      </div>

      <button onClick={generate} className="px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">生成密码</button>

      {password && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg px-4 py-3">
            <code className="flex-1 font-mono text-base text-[var(--color-text)] break-all">{password}</code>
            <button onClick={copy} className="flex-shrink-0 px-4 py-1.5 bg-[var(--color-muted)] rounded-lg text-sm hover:brightness-95 transition-colors text-[var(--color-text-dim)]">复制</button>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)]">
            <span>强度：{s.label}</span>
            <div className="w-24 h-1.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: s.width }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
