"use client";

import { useState, useRef } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [quality, setQuality] = useLocalStorage("tool-img64-quality", 0.9);
  const { show: toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const encode = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    setError("");

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setBase64(result);
    };
    reader.onerror = () => setError("文件读取失败");
    reader.readAsDataURL(file);
  };

  const compress = (file: File) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const maxW = 1024;
      let w = img.width;
      let h = img.height;
      if (w > maxW) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      }
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const compressed = canvas.toDataURL(file.type || "image/png", quality);
      setPreview(compressed);
      setBase64(compressed);
      const bytes = Math.round((compressed.length - (compressed.indexOf("base64,") + 7)) * 0.75);
      setFileName(file.name + " (压缩后)");
      setFileSize(bytes);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("文件不能超过 20MB");
      return;
    }
    encode(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const base64Length = base64 ? base64.length - (base64.indexOf("base64,") + 7) : 0;

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragging ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]" : "border-[var(--color-border)] bg-[var(--color-muted)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)]"}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <p className="text-4xl mb-2">🖼️</p>
        <p className="text-[var(--color-text-dim)] text-sm">点击或拖拽图片到这里</p>
        <p className="text-[var(--color-text-faint)] text-xs mt-1">支持 PNG / JPG / GIF / WebP / SVG，最大 20MB</p>
      </div>

      {error && <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg px-4 py-3 text-sm text-[var(--color-error-text)]">{error}</div>}

      {preview && (
        <>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-[var(--color-text-dim)]">{fileName}</span>
            <span className="text-xs text-[var(--color-text-faint)]">{(fileSize / 1024).toFixed(1)} KB</span>
            {base64 && (
              <button onClick={() => { if (copyToClipboard(base64)) toast("已复制 Base64"); }} className="px-3 py-1 border border-[var(--color-border)] rounded-lg text-xs hover:bg-[var(--color-muted)] text-[var(--color-text-dim)] ml-auto">
                复制 Base64
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg px-4 py-2">
            <label className="text-xs text-[var(--color-text-dim)] whitespace-nowrap">压缩品质: {Math.round(quality * 100)}%</label>
            <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => { const q = Number(e.target.value); setQuality(q); const f = inputRef.current?.files?.[0]; if (f) compress(f); }} className="flex-1 accent-[var(--color-accent)]" />
          </div>

          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="max-w-full mx-auto" style={{ maxHeight: 300 }} />
          </div>

          <div>
            <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">
              Base64 ({base64Length.toLocaleString()} 字符)
            </label>
            <textarea value={base64} readOnly className="w-full h-36 p-3 border border-[var(--color-border)] rounded-lg font-mono text-xs resize-y bg-[var(--color-output)] text-[var(--color-text)] outline-none" />
          </div>
        </>
      )}
    </div>
  );
}
