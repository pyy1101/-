"use client";

import { useState, useRef, useEffect } from "react";
import QRCodeLib from "qrcode";

export default function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text.trim()) {
      setQrDataUrl("");
      return;
    }
    const timer = setTimeout(() => {
      QRCodeLib.toDataURL(
        text,
        { width: size, margin: 2, color: { dark: "#000000", light: "#ffffff" } },
        (err, url) => {
          if (!err) setQrDataUrl(url);
        }
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [text, size]);

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
          <label className="block text-xs text-gray-500 font-medium mb-1">输入文本或网址</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">尺寸 {size}px</label>
          <input type="range" min={128} max={512} step={16} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-32" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center gap-4">
        {qrDataUrl ? (
          <>
            <img src={qrDataUrl} alt="QR Code" className="border border-gray-100 rounded" />
            <button onClick={download} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">下载 PNG</button>
          </>
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-gray-300 text-sm border border-dashed border-gray-200 rounded">输入内容生成二维码</div>
        )}
      </div>
    </div>
  );
}
