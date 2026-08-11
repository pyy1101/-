"use client";

import { useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";

interface DiffLine {
  type: "same" | "add" | "remove";
  text: string;
  lineNum: number;
}

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const m = linesA.length;
  const n = linesB.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = m, j = n;
  const temp: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      temp.push({ type: "same", text: linesA[i - 1], lineNum: i });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.push({ type: "add", text: linesB[j - 1], lineNum: j });
      j--;
    } else {
      temp.push({ type: "remove", text: linesA[i - 1], lineNum: i });
      i--;
    }
  }
  return temp.reverse();
}

export default function DiffChecker() {
  const [textA, setTextA] = useLocalStorage("tool-diff-texta", "");
  const [textB, setTextB] = useLocalStorage("tool-diff-textb", "");
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [comparing, setComparing] = useState(false);
  const [tooLarge, setTooLarge] = useState(false);

  const MAX_LINES = 3000;
  const lineCountA = textA ? textA.split("\n").length : 0;
  const lineCountB = textB ? textB.split("\n").length : 0;

  const compare = () => {
    if (lineCountA > MAX_LINES || lineCountB > MAX_LINES) {
      setTooLarge(true);
      return;
    }
    setTooLarge(false);
    setComparing(true);
    setTimeout(() => {
      setDiff(computeDiff(textA, textB));
      setComparing(false);
    }, 50);
  };

  useKeyboardShortcut("Enter", compare);

  const added = diff.filter((d) => d.type === "add").length;
  const removed = diff.filter((d) => d.type === "remove").length;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button onClick={compare} disabled={comparing} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50">
          {comparing ? "对比中..." : "对比差异"}
        </button>
        {diff.length > 0 && (
          <span className="text-sm text-[var(--color-text-dim)]">
            <span className="text-[var(--color-success-text)] font-medium">+{added}</span>
            {" / "}
            <span className="text-[var(--color-error-text)] font-medium">-{removed}</span>
          </span>
        )}
      </div>

      {tooLarge && (
        <div className="bg-[var(--color-warning)] border border-[var(--color-warning-border)] rounded-lg px-4 py-3 text-sm text-[var(--color-warning-text)]">
          文本行数过多（{Math.max(lineCountA, lineCountB)} 行），最大支持 {MAX_LINES} 行对比，避免浏览器卡顿。请拆分后再试。
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">
            原始文本
            {textA && <span className="text-[var(--color-text-faint)] ml-2">{lineCountA} 行{lineCountA > MAX_LINES ? <span className="text-[var(--color-warning-text)]">（超出限制）</span> : ""}</span>}
          </label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="w-full h-72 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="粘贴原始文本..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">
            新文本
            {textB && <span className="text-[var(--color-text-faint)] ml-2">{lineCountB} 行{lineCountB > MAX_LINES ? <span className="text-[var(--color-warning-text)]">（超出限制）</span> : ""}</span>}
          </label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="w-full h-72 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="粘贴新文本..."
            spellCheck={false}
          />
        </div>
      </div>

      {diff.length > 0 && (
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">差异结果</label>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg overflow-hidden font-mono text-sm leading-relaxed">
            <div className="max-h-96 overflow-y-auto">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`flex px-4 py-0.5 ${
                    line.type === "add" ? "bg-[var(--color-success)] text-[var(--color-success-text)]" :
                    line.type === "remove" ? "bg-[var(--color-error)] text-[var(--color-error-text)]" :
                    "text-[var(--color-text)]"
                  }`}
                >
                  <span className="w-6 text-[var(--color-text-faint)] flex-shrink-0 select-none">
                    {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                  </span>
                  <span>{line.text || " "}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
