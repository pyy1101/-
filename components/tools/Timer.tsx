"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(60);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"countdown" | "stopwatch">("countdown");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const start = useCallback(() => {
    if (running) return;
    setRunning(true);
    const end = Date.now() + (mode === "countdown" ? remaining > 0 ? remaining : seconds : 0) * 1000;
    const startTime = mode === "stopwatch" ? Date.now() - remaining * 1000 : Date.now();

    intervalRef.current = setInterval(() => {
      if (mode === "countdown") {
        const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        setRemaining(left);
        if (left <= 0) { clearInterval(intervalRef.current!); setRunning(false); }
      } else {
        setRemaining(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 100);
  }, [running, mode, seconds, remaining]);

  const pause = () => { if (intervalRef.current) clearInterval(intervalRef.current); setRunning(false); };
  const reset = () => { pause(); setRemaining(0); };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { reset(); setMode("countdown"); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "countdown" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>倒计时</button>
        <button onClick={() => { reset(); setMode("stopwatch"); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "stopwatch" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>秒表</button>
      </div>

      {mode === "countdown" && !running && remaining === 0 && (
        <div className="flex gap-2 flex-wrap items-center">
          <input type="number" min={1} max={86400} value={seconds} onChange={(e) => setSeconds(Number(e.target.value) || 60)} className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-center" />
          <span className="text-sm text-gray-500">秒</span>
        </div>
      )}

      <div className="text-center py-8">
        <div className="text-6xl font-mono font-bold text-gray-900 tabular-nums">{formatTime(remaining || seconds)}</div>
        <div className="flex gap-3 justify-center mt-6">
          {!running ? <button onClick={start} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">开始</button> : <button onClick={pause} className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600">暂停</button>}
          <button onClick={reset} className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">重置</button>
        </div>
      </div>
    </div>
  );
}
