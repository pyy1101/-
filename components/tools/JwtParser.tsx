"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  try {
    return decodeURIComponent(atob(str).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
  } catch {
    return atob(str);
  }
}

function formatJson(obj: unknown): string {
  try { return JSON.stringify(obj, null, 2); } catch { return String(obj); }
}

export default function JwtParser() {
  const [token, setToken] = useLocalStorage("tool-jwt-token", "");
  const [parts, setParts] = useState<{ header: unknown; payload: unknown; signature: string; isValid: boolean; error?: string; expired?: boolean } | null>(null);
  const debouncedToken = useDebounce(token, 400);

  const decode = () => {
    const trimmed = token.trim();
    if (!trimmed) { setParts(null); return; }
    const segments = trimmed.split(".");
    if (segments.length !== 3) {
      setParts({ header: null, payload: null, signature: "", isValid: false, error: "JWT 格式错误：应包含 header.payload.signature 三部分" });
      return;
    }
    try {
      const header = JSON.parse(base64UrlDecode(segments[0]));
      const payload = JSON.parse(base64UrlDecode(segments[1]));
      const expired = payload.exp ? Date.now() > payload.exp * 1000 : undefined;
      setParts({ header, payload, signature: segments[2], isValid: true, expired });
    } catch {
      setParts({ header: null, payload: null, signature: "", isValid: false, error: "解码失败：Base64 解析错误，请检查 JWT 是否完整" });
    }
  };

  useEffect(() => { decode(); }, [debouncedToken]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", decode);

  const formatTimestamp = (t: number) => {
    try { return new Date(t * 1000).toLocaleString("zh-CN"); } catch { return String(t); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="粘贴 JWT token（格式：header.payload.signature）..." className="flex-1 h-24 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" spellCheck={false} />
        <button onClick={decode} disabled={!token.trim()} className="flex-shrink-0 px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 h-fit">解析</button>
      </div>

      {parts && (
        <div className="space-y-4">
          {parts.error ? (
            <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg px-4 py-3 text-sm text-[var(--color-error-text)]">{parts.error}</div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--color-text-dim)]">状态：</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${parts.expired ? "bg-[var(--color-error)] text-[var(--color-error-text)]" : "bg-[var(--color-success)] text-[var(--color-success-text)]"}`}>
                  {parts.expired ? "已过期" : "有效"}
                </span>
                {parts.payload && (parts.payload as Record<string, unknown>).exp ? (
                  <span className="text-[var(--color-text-faint)] text-xs">过期时间：{formatTimestamp((parts.payload as Record<string, unknown>).exp as number)}</span>
                ) : null}
              </div>

              <details open className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg">
                <summary className="px-4 py-2.5 text-sm font-medium text-[var(--color-text)] cursor-pointer select-none bg-[var(--color-output)] rounded-t-lg">HEADER（算法声明）</summary>
                <pre className="px-4 py-3 text-sm font-mono text-[var(--color-text)] overflow-auto max-h-60">{formatJson(parts.header)}</pre>
              </details>

              <details open className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg">
                <summary className="px-4 py-2.5 text-sm font-medium text-[var(--color-text)] cursor-pointer select-none bg-[var(--color-output)] rounded-t-lg">PAYLOAD（载荷数据）</summary>
                <pre className="px-4 py-3 text-sm font-mono text-[var(--color-text)] overflow-auto max-h-80">{formatJson(parts.payload)}</pre>
              </details>

              <details className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg">
                <summary className="px-4 py-2.5 text-sm font-medium text-[var(--color-text-dim)] cursor-pointer select-none bg-[var(--color-output)] rounded-t-lg">SIGNATURE（签名）</summary>
                <pre className="px-4 py-3 text-xs font-mono text-[var(--color-text-faint)] break-all select-all">{parts.signature}</pre>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}
