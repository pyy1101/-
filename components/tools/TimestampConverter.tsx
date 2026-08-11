"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function TimestampConverter() {
  const now = Math.floor(Date.now() / 1000);
  const [timestamp, setTimestamp] = useLocalStorage("tool-ts-input", String(now));
  const [dateStr, setDateStr] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const { show: toast } = useToast();
  const debouncedTs = useDebounce(timestamp, 400);

  const toDate = () => {
    setError("");
    try {
      let ts = Number(debouncedTs);
      if (ts > 9999999999999) ts = Math.floor(ts / 1000);
      const d = new Date(ts * 1000);
      if (isNaN(d.getTime())) throw new Error("Invalid timestamp");
      setResult(formatDate(d));
    } catch {
      setError("无效的时间戳");
      setResult("");
    }
  };

  useEffect(() => {
    if (debouncedTs) toDate();
    else { setResult(""); setError(""); }
  }, [debouncedTs]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", toDate);

  const toTimestamp = () => {
    setError("");
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) throw new Error("Invalid date");
      const ts = Math.floor(d.getTime() / 1000);
      setResult(String(ts));
    } catch {
      setError("无效的日期格式");
      setResult("");
    }
  };

  const setNow = () => {
    const ts = Math.floor(Date.now() / 1000);
    setTimestamp(String(ts));
    setDateStr(formatDateForInput(new Date()));
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-5">
        <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">时间戳 → 日期</h3>
        <div className="flex gap-2 flex-wrap">
          <input type="text" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border border-[var(--color-border)] rounded-lg font-mono text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="输入 Unix 时间戳" />
          <button onClick={toDate} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">转换</button>
          <button onClick={setNow} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">当前时间</button>
        </div>
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-5">
        <h3 className="text-sm font-medium text-[var(--color-text)] mb-3">日期 → 时间戳</h3>
        <div className="flex gap-2 flex-wrap">
          <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" />
          <button onClick={toTimestamp} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">转换</button>
        </div>
      </div>

      {result && (
        <div className="bg-[var(--color-success)] border border-[var(--color-success-border)] rounded-lg p-4 font-mono text-sm text-[var(--color-success-text)] break-all flex items-center justify-between">
          <span>结果：{result}</span>
          <button onClick={() => { if (copyToClipboard(result)) toast("已复制"); }} className="text-xs text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">复制</button>
        </div>
      )}
      {error && (
        <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg p-4 text-sm text-[var(--color-error-text)]">{error}</div>
      )}
    </div>
  );
}

function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const day = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()];
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss} ${day}`;
}

function formatDateForInput(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
