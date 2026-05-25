"use client";

import { useState } from "react";

export default function TimestampConverter() {
  const now = Math.floor(Date.now() / 1000);
  const [timestamp, setTimestamp] = useState(String(now));
  const [dateStr, setDateStr] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const toDate = () => {
    setError("");
    try {
      let ts = Number(timestamp);
      if (ts > 9999999999999) ts = Math.floor(ts / 1000); // ms → s
      const d = new Date(ts * 1000);
      if (isNaN(d.getTime())) throw new Error("Invalid timestamp");
      setResult(formatDate(d));
    } catch {
      setError("无效的时间戳");
      setResult("");
    }
  };

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
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">时间戳 → 日期</h3>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入 Unix 时间戳"
          />
          <button onClick={toDate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">转换</button>
          <button onClick={setNow} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">当前时间</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">日期 → 时间戳</h3>
        <div className="flex gap-2 flex-wrap">
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={toTimestamp} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">转换</button>
        </div>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 font-mono text-sm text-green-800 break-all">
          结果：{result}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          {error}
        </div>
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
