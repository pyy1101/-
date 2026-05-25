"use client";

import { useState } from "react";

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

  // LCS
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

  // Backtrack
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
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);

  const compare = () => {
    setDiff(computeDiff(textA, textB));
  };

  const added = diff.filter((d) => d.type === "add").length;
  const removed = diff.filter((d) => d.type === "remove").length;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button onClick={compare} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">对比差异</button>
        {diff.length > 0 && (
          <span className="text-sm text-gray-500">
            <span className="text-green-600 font-medium">+{added}</span>
            {" / "}
            <span className="text-red-600 font-medium">-{removed}</span>
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">原始文本</label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="w-full h-72 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="粘贴原始文本..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">新文本</label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="w-full h-72 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="粘贴新文本..."
            spellCheck={false}
          />
        </div>
      </div>

      {diff.length > 0 && (
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">差异结果</label>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden font-mono text-sm leading-relaxed">
            <div className="max-h-96 overflow-y-auto">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`flex px-4 py-0.5 ${
                    line.type === "add" ? "bg-green-50 text-green-800" :
                    line.type === "remove" ? "bg-red-50 text-red-800" :
                    "text-gray-700"
                  }`}
                >
                  <span className="w-6 text-gray-400 flex-shrink-0 select-none">
                    {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                  </span>
                  <span>{line.text || " "}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
