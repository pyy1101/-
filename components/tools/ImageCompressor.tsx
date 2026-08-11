"use client";

import { useState, useRef, useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

export default function ImageCompressor() {
  const [original, setOriginal] = useState<{ file: File; url: string; size: number } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useLocalStorage("tool-imgcomp-quality", 0.7);
  const [format, setFormat] = useLocalStorage<"image/jpeg" | "image/png" | "image/webp">("tool-imgcomp-format", "image/jpeg");
  const [maxWidth, setMaxWidth] = useLocalStorage("tool-imgcomp-maxwidth", 1920);
  const [compressing, setCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compress = useCallback(async () => {
    if (!original) return;
    setCompressing(true);

    const img = new Image();
    img.src = original.url;
    await new Promise<void>((resolve) => { img.onload = () => resolve(); });

    const canvas = document.createElement("canvas");
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (w > maxWidth) {
      h = Math.round(h * (maxWidth / w));
      w = maxWidth;
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setCompressed({
          url: URL.createObjectURL(blob),
          size: blob.size,
        });
        setCompressing(false);
      },
      format,
      quality
    );
  }, [original, quality, format, maxWidth]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginal({ file, url: URL.createObjectURL(file), size: file.size });
    setCompressed(null);
  };

  const download = () => {
    if (!compressed || !original) return;
    const a = document.createElement("a");
    const ext = format.split("/")[1];
    a.href = compressed.url;
    a.download = original.file.name.replace(/\.[^.]+$/, `_compressed.${ext}`);
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-end">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输出格式</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as typeof format)} className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)]">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">质量 {Math.round(quality * 100)}%</label>
          <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-32 accent-[var(--color-accent)]" />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">最大宽度 {maxWidth}px</label>
          <input type="range" min={100} max={3840} step={10} value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} className="w-32 accent-[var(--color-accent)]" />
        </div>
      </div>

      <div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button onClick={() => inputRef.current?.click()} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">
          选择图片
        </button>
      </div>

      {original && (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--color-text-dim)]">原图：{original.file.name} ({formatSize(original.size)})</span>
            <button onClick={compress} disabled={compressing} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50">
              {compressing ? "压缩中..." : "开始压缩"}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[var(--color-text-dim)] mb-1">原图预览</div>
              <img src={original.url} alt="Original" className="max-h-60 rounded-lg border border-[var(--color-border)] object-contain bg-[var(--color-muted)] w-full" />
            </div>
            {compressed && (
              <div>
                <div className="text-xs text-[var(--color-text-dim)] mb-1">
                  压缩后 ({formatSize(compressed.size)}) —
                  减小 {((1 - compressed.size / original.size) * 100).toFixed(1)}%
                </div>
                <img src={compressed.url} alt="Compressed" className="max-h-60 rounded-lg border border-[var(--color-success-border)] object-contain bg-[var(--color-muted)] w-full" />
                <button onClick={download} className="mt-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">
                  下载
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
