"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch { /* Web Audio not supported */ }
}

export default function Timer() {
  const [seconds, setSeconds] = useLocalStorage("tool-timer-seconds", 60);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useLocalStorage<"countdown" | "stopwatch">("tool-timer-mode", "countdown");
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const runningRef = useRef(running);
  const modeRef = useRef(mode);
  const secondsRef = useRef(seconds);
  const remainingRef = useRef(remaining);
  runningRef.current = running;
  modeRef.current = mode;
  secondsRef.current = seconds;
  remainingRef.current = remaining;

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const start = useCallback(() => {
    const r = runningRef.current;
    const m = modeRef.current;
    const s = secondsRef.current;
    const rem = remainingRef.current;
    if (r) return;
    setRunning(true);
    const end = Date.now() + (m === "countdown" ? rem > 0 ? rem : s : 0) * 1000;
    const startTime = m === "stopwatch" ? Date.now() - rem * 1000 : Date.now();

    intervalRef.current = setInterval(() => {
      if (m === "countdown") {
        const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        setRemaining(left);
        if (left <= 0) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          playBeep();
          setTimeout(() => playBeep(), 300);
        }
      } else {
        setRemaining(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 100);
  }, []);

  const pause = useCallback(() => { if (intervalRef.current) clearInterval(intervalRef.current); setRunning(false); }, []);

  // Space bar to toggle start/pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (runningRef.current) pause();
        else start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, pause]);

  const reset = () => { pause(); setRemaining(0); setLaps([]); };

  const addLap = () => {
    if (mode === "stopwatch" && running) {
      setLaps((prev) => [...prev, remaining]);
    }
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { reset(); setMode("countdown"); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "countdown" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>倒计时</button>
        <button onClick={() => { reset(); setMode("stopwatch"); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "stopwatch" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>秒表</button>
      </div>

      {mode === "countdown" && !running && remaining === 0 && (
        <div className="flex gap-2 flex-wrap items-center">
          <input type="number" min={1} max={86400} value={seconds} onChange={(e) => setSeconds(Number(e.target.value) || 60)} className="w-24 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)] text-center" />
          <span className="text-sm text-[var(--color-text-dim)]">秒</span>
        </div>
      )}

      <div className="text-center py-8">
        <div className="text-6xl font-mono font-bold text-[var(--color-text)] tabular-nums">{formatTime(remaining || seconds)}</div>
        <div className="flex gap-3 justify-center mt-6">
          {!running ? <button onClick={start} className="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg font-medium hover:bg-[var(--color-accent-hover)]">开始</button> : <button onClick={pause} className="px-6 py-2.5 bg-[var(--color-warning)] text-white rounded-lg font-medium hover:brightness-90">暂停</button>}
          <button onClick={reset} className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg font-medium hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">重置</button>
          {mode === "stopwatch" && running && (
            <button onClick={addLap} className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg font-medium hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">计圈</button>
          )}
        </div>
        <p className="text-xs text-[var(--color-text-faint)] mt-2">按空格键 开始/暂停</p>
      </div>

      {laps.length > 0 && (
        <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
          <div className="bg-[var(--color-output)] px-4 py-2 text-xs text-[var(--color-text-dim)] font-medium border-b border-[var(--color-border)]">计圈记录</div>
          <div className="max-h-48 overflow-y-auto">
            {laps.map((lap, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border-light)] last:border-0 text-sm font-mono text-[var(--color-text)]">
                <span className="text-[var(--color-text-faint)]">#{laps.length - i}</span>
                <span>{formatTime(lap)}</span>
                {i > 0 && <span className="text-[var(--color-text-faint)] text-xs">+{formatTime(lap - laps[i - 1])}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
