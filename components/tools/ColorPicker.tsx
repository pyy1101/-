"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

function hexToRgba(hex: string, alpha: number): [number, number, number, number] | null {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16), alpha];
}

function rgbaToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorPicker() {
  const [hex, setHex] = useLocalStorage("tool-color-hex", "#3b82f6");
  const [alpha, setAlpha] = useLocalStorage("tool-color-alpha", 1);
  const { show: toast } = useToast();

  const rgba = useMemo(() => hexToRgba(hex, alpha), [hex, alpha]);
  const rgb: [number, number, number] | null = rgba ? [rgba[0], rgba[1], rgba[2]] : null;

  const handleHexChange = (val: string) => {
    setHex(val);
  };

  const handleHexBlur = () => {
    if (!hex.match(/^#[a-f\d]{6}$/i)) setHex("#3b82f6");
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    setHex(rgbaToHex(r, g, b));
  };

  const color = rgba ? `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})` : "#3b82f6";
  const hsl = rgb ? rgbToHsl(...rgb) : [0, 0, 0];

  const formatRgba = () => {
    if (!rgba) return "";
    const [r, g, b, a] = rgba;
    return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a.toFixed(2).replace(/\.?0+$/, "")})`;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">拾色器</label>
          <input type="color" value={hex.match(/^#[a-f\d]{6}$/i) ? hex : "#3b82f6"} onChange={(e) => { setHex(e.target.value); setAlpha(1); }} className="w-20 h-20 rounded-lg border border-[var(--color-border)] cursor-pointer" />
        </div>

        <div className="flex-1 space-y-3 min-w-[240px]">
          <div>
            <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">HEX</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                onBlur={handleHexBlur}
                className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg font-mono text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              <button onClick={() => { if (copyToClipboard(hex)) toast("已复制 HEX"); }} className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">复制</button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">透明度 (Alpha)</label>
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={1} step={0.01} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} className="flex-1 accent-[var(--color-accent)]" />
              <span className="text-xs text-[var(--color-text-dim)] font-mono w-10">{Math.round(alpha * 100)}%</span>
            </div>
          </div>

          {rgba && (
            <>
              <div>
                <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">
                  {formatRgba()}
                </label>
                <button onClick={() => { if (copyToClipboard(formatRgba())) toast("已复制 RGB(A)"); }} className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-accent)] transition-colors">复制 RGBA 值</button>
              </div>
              <div>
                <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">
                  RGB 通道
                </label>
                <div className="flex gap-2">
                  {["R", "G", "B"].map((ch, i) => (
                    <div key={ch} className="flex-1">
                      <div className="text-xs text-[var(--color-text-faint)] mb-1">{ch}</div>
                      <input
                        type="range"
                        min={0} max={255}
                        value={rgb![i]}
                        onChange={(e) => {
                          const n = [...rgb!] as [number, number, number];
                          n[i] = Number(e.target.value);
                          handleRgbChange(n[0], n[1], n[2]);
                        }}
                        className="w-full accent-[var(--color-accent)]"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">
                  HSL ({hsl[0]}&deg;, {hsl[1]}%, {hsl[2]}%)
                </label>
              </div>
            </>
          )}
        </div>

        <div
          className="w-24 h-24 rounded-lg border border-[var(--color-border)] flex-shrink-0"
          style={{
            backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
          }}
        >
          <div className="w-full h-full rounded-lg" style={{ backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}
