"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function JsonToCsv() {
  const [input, setInput] = useLocalStorage("tool-json2csv-input", "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useLocalStorage<"json2csv" | "csv2json">("tool-json2csv-mode", "json2csv");
  const [delimiter, setDelimiter] = useLocalStorage("tool-json2csv-delim", ",");
  const { show: toast } = useToast();
  const debouncedInput = useDebounce(input, 400);

  const convert = () => {
    setError("");
    if (!debouncedInput.trim()) { setOutput(""); return; }
    try {
      if (mode === "json2csv") {
        const data = JSON.parse(debouncedInput);
        const arr = Array.isArray(data) ? data : [data];
        if (arr.length === 0) { setError("JSON 数组为空"); setOutput(""); return; }

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
        const csvRows = [headers.join(delimiter)];
        for (const row of flattened) {
          csvRows.push(headers.map((h) => {
            const val = row[h] ?? "";
            return val.includes(delimiter) || val.includes('"') || val.includes("\n") ? `"${val.replace(/"/g, '""')}"` : val;
          }).join(delimiter));
        }
        setOutput(csvRows.join("\n"));
      } else {
        // CSV to JSON
        const lines = debouncedInput.trim().split("\n");
        if (lines.length < 2) { setError("CSV 至少需要标题行和一行数据"); setOutput(""); return; }

        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (inQuotes) {
              if (ch === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                  current += '"';
                  i++;
                } else {
                  inQuotes = false;
                }
              } else {
                current += ch;
              }
            } else {
              if (ch === '"') {
                inQuotes = true;
              } else if (ch === delimiter) {
                result.push(current.trim());
                current = "";
              } else {
                current += ch;
              }
            }
          }
          result.push(current.trim());
          return result;
        };

        const headers = parseCSVLine(lines[0]);
        const rows = lines.slice(1).map((line) => {
          const values = parseCSVLine(line);
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => { obj[h] = values[i] ?? ""; });
          return obj;
        });
        setOutput(JSON.stringify(rows, null, 2));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  useEffect(() => { convert(); }, [debouncedInput, mode, delimiter]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", convert);

  const download = () => {
    const ext = mode === "json2csv" ? "csv" : "json";
    const mime = mode === "json2csv" ? "text/csv;charset=utf-8" : "application/json";
    const content = mode === "json2csv" ? "﻿" + output : output;
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `output.${ext}`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={() => { setMode("json2csv"); setOutput(""); setError(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "json2csv" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>JSON → CSV</button>
        <button onClick={() => { setMode("csv2json"); setOutput(""); setError(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "csv2json" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>CSV → JSON</button>
        <div className="flex items-center gap-1 text-sm text-[var(--color-text-dim)]">
          <label>分隔符：</label>
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="px-2 py-1.5 border border-[var(--color-border)] rounded text-sm bg-[var(--color-input)] text-[var(--color-text)]">
            <option value=",">逗号 (,)</option>
            <option value=";">分号 (;)</option>
            <option value="\t">制表符 (Tab)</option>
            <option value="|">竖线 (|)</option>
          </select>
        </div>
        <button onClick={convert} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">转换</button>
        {output && <button onClick={download} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">下载</button>}
        {output && <button onClick={() => { if (copyToClipboard(output)) toast("已复制到剪贴板"); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">复制</button>}
      </div>
      <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} className="w-full h-48 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder={mode === "json2csv" ? '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]' : 'name,age\nAlice,30\nBob,25'} spellCheck={false} />
      {error && <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg p-3 text-sm text-[var(--color-error-text)]">{error}</div>}
      {output && <textarea value={output} readOnly className="w-full h-48 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-output)] text-[var(--color-text)] outline-none" spellCheck={false} />}
    </div>
  );
}
