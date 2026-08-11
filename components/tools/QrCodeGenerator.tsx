"use client";

import { useState, useEffect } from "react";
import QRCodeLib from "qrcode";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function QrCodeGenerator() {
  const [text, setText] = useLocalStorage("tool-qrcode-text", "");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [size, setSize] = useLocalStorage("tool-qrcode-size", 256);
  const { show: toast } = useToast();
  const debouncedText = useDebounce(text, 300);

  useEffect(() => {
    if (!debouncedText.trim()) {
      setQrDataUrl("");
      return;
    }
    QRCodeLib.toDataURL(
      debouncedText,
      { width: size, margin: 2, color: { dark: "#000000", light: "#ffffff" } },
      (err, url) => {
        if (!err) setQrDataUrl(url);
      }
    );
  }, [debouncedText, size]);

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-end">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">输入文本或网址</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">尺寸 {size}px</label>
          <input type="range" min={128} max={512} step={16} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-32" />
        </div>
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-6 flex flex-col items-center gap-4">
        {qrDataUrl ? (
          <>
            <img src={qrDataUrl} alt="QR Code" className="border border-[var(--color-border-light)] rounded" />
            <div className="flex gap-2">
              <button onClick={download} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)]">下载 PNG</button>
              <button onClick={() => { if (copyToClipboard(qrDataUrl)) toast("已复制 Data URL"); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">复制 Data URL</button>
            </div>
          </>
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-[var(--color-text-faint)] text-sm border border-dashed border-[var(--color-border)] rounded">输入内容生成二维码</div>
        )}
      </div>
    </div>
  );
}
