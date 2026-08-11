"use client";

import { useState, useEffect } from "react";
import yaml from "js-yaml";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function YamlJson() {
  const [yamlInput, setYamlInput] = useLocalStorage("tool-yaml-input", "");
  const [jsonInput, setJsonInput] = useLocalStorage("tool-yaml-json", "");
  const [error, setError] = useState("");
  const [lastEdited, setLastEdited] = useState<"yaml" | "json">("yaml");
  const { show: toast } = useToast();
  const debouncedYaml = useDebounce(yamlInput, 400);
  const debouncedJson = useDebounce(jsonInput, 400);

  useEffect(() => {
    if (lastEdited !== "yaml") return;
    setError("");
    if (!debouncedYaml.trim()) { setJsonInput(""); return; }
    try {
      const obj = yaml.load(debouncedYaml);
      setJsonInput(JSON.stringify(obj, null, 2));
    } catch (e: any) {
      setError(e.message || "YAML 解析失败");
    }
  }, [debouncedYaml]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (lastEdited !== "json") return;
    setError("");
    if (!debouncedJson.trim()) { setYamlInput(""); return; }
    try {
      const obj = JSON.parse(debouncedJson);
      setYamlInput(yaml.dump(obj, { indent: 2, lineWidth: -1, noRefs: true }));
    } catch (e: any) {
      setError(e.message || "JSON 解析失败");
    }
  }, [debouncedJson]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", () => {});

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-[var(--color-text-dim)] font-medium">YAML</label>
            <button onClick={() => { if (copyToClipboard(yamlInput)) toast("已复制"); }} className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)] transition-colors">复制</button>
          </div>
          <textarea
            value={yamlInput}
            onChange={(e) => { setYamlInput(e.target.value); setLastEdited("yaml"); }}
            placeholder="在此输入 YAML..."
            className="w-full h-96 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-[var(--color-text-dim)] font-medium">JSON</label>
            <button onClick={() => { if (copyToClipboard(jsonInput)) toast("已复制"); }} className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)] transition-colors">复制</button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => { setJsonInput(e.target.value); setLastEdited("json"); }}
            placeholder="在此输入 JSON..."
            className="w-full h-96 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            spellCheck={false}
          />
        </div>
      </div>
      {error && <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg px-4 py-3 text-sm text-[var(--color-error-text)]">{error}</div>}
    </div>
  );
}
