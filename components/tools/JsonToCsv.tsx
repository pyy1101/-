"use client";

import { useState } from "react";

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) { setError("JSON 数组为空"); return; }

      // Flatten nested objects
      const flatten = (obj: Record<string, unknown>, prefix = ""): Record<string, string> => {
        const result: Record<string, string> = {};
        for (const [k, v] of Object.entries(obj)) {
          const key = prefix ? `${prefix}.${k}` : k;
          if (v !== null && typeof v === "object" && !Array.isArray(v)) {
            Object.assign(result, flatten(v as Record<string, unknown>, key));
          } else {
            result[key] = String(v ?? "");
          }
        }
        return result;
      };

      const flattened = arr.map((item) => flatten(item));
      const headers = [...new Set(flattened.flatMap((obj) => Object.keys(obj)))];
      const csvRows = [headers.join(",")];
      for (const row of flattened) {
        csvRows.push(headers.map((h) => {
          const val = row[h] ?? "";
          return val.includes(",") || val.includes('"') || val.includes("\n") ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(","));
      }
      setOutput(csvRows.join("\n"));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const download = () => {
    const blob = new Blob(["﻿" + output], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "output.csv";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">转换为 CSV</button>
        {output && <button onClick={download} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">下载 CSV</button>}
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">复制</button>}
      </div>
      <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]' spellCheck={false} />
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{error}</div>}
      {output && <textarea value={output} readOnly className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-gray-50 outline-none" spellCheck={false} />}
    </div>
  );
}
