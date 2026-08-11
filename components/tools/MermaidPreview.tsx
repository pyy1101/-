"use client";

import { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";

let initialized = false;

export default function MermaidPreview() {
  const [code, setCode] = useLocalStorage("tool-mermaid-code", `graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作]
    B -->|否| D[结束]
    C --> D`);
  const [error, setError] = useState("");
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedCode = useDebounce(code, 400);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
      initialized = true;
    }
  }, []);

  useEffect(() => {
    if (!debouncedCode.trim()) { setError(""); setPngUrl(null); return; }
    const timer = setTimeout(async () => {
      try {
        const id = "mermaid-" + Math.random().toString(36).slice(2);
        const { svg } = await mermaid.render(id, debouncedCode);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;

          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            const serializer = new XMLSerializer();
            const svgStr = serializer.serializeToString(svgEl);
            const bytes = new TextEncoder().encode(svgStr);
            let binary = "";
            for (let i = 0; i < bytes.length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const source = "data:image/svg+xml;base64," + btoa(binary);
            setPngUrl(source);

            const svgHeight = svgEl.getBoundingClientRect().height;
            if (svgHeight < 30) {
              svgEl.style.minHeight = "200px";
            }
          }
        }
        setError("");
      } catch (e: any) {
        if (containerRef.current) containerRef.current.innerHTML = "";
        setPngUrl(null);
        const msg = e.message || e.toString();
        setError(msg.length > 120 ? msg.slice(0, 120) + "..." : msg);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [debouncedCode]);

  const downloadPNG = () => {
    if (!pngUrl) return;
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "mermaid-diagram.svg";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">Mermaid 代码</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-[var(--color-text-dim)] font-medium">预览</label>
            {pngUrl && (
              <button onClick={downloadPNG} className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)] transition-colors">下载 SVG</button>
            )}
          </div>
          <div className="h-96 border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] p-4 overflow-auto">
            {error ? (
              <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg px-4 py-3 text-sm text-[var(--color-error-text)] font-mono">{error}</div>
            ) : (
              <div ref={containerRef} className="flex items-center justify-center min-h-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
