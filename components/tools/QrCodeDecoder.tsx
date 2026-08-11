"use client";

import { useState, useRef } from "react";
import jsQR from "jsqr";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function QrCodeDecoder() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const { show: toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const decode = (file: File) => {
    setFileName(file.name);
    setError("");
    setResult(null);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const max = 800;
      let w = img.width;
      let h = img.height;
      if (w > max || h > max) {
        const ratio = Math.min(max / w, max / h);
        w = Math.floor(w * ratio);
        h = Math.floor(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const code = jsQR(imageData.data, w, h);
      if (code) {
        setResult(code.data);
      } else {
        setError("未识别到二维码，请确认图片中包含清晰的二维码");
      }
    };
    img.onerror = () => setError("图片加载失败");
    img.src = URL.createObjectURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) decode(file);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragging ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]" : result ? "border-[var(--color-success-border)] bg-[var(--color-success)]" : error ? "border-[var(--color-error-border)] bg-[var(--color-error)]" : "border-[var(--color-border)] bg-[var(--color-muted)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)]"}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) decode(f); }} />
        <p className="text-4xl mb-2">📷</p>
        <p className="text-[var(--color-text-dim)] text-sm">点击或拖拽二维码图片到这里</p>
        {fileName && <p className="text-[var(--color-text-faint)] text-xs mt-1">{fileName}</p>}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {result && (
        <div className="bg-[var(--color-card)] border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--color-success-text)] font-medium">识别成功</span>
            <button onClick={() => { if (copyToClipboard(result)) toast("已复制到剪贴板"); }} className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)] transition-colors">复制</button>
          </div>
          <div className="bg-[var(--color-output)] rounded-lg p-3 font-mono text-sm text-[var(--color-text)] break-all whitespace-pre-wrap">{result}</div>
        </div>
      )}

      {error && (
        <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg px-4 py-3 text-sm text-[var(--color-error-text)]">{error}</div>
      )}
    </div>
  );
}
