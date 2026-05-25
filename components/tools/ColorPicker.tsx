"use client";

import { useState, useMemo } from "react";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export default function ColorPicker() {
  const [hex, setHex] = useState("#3b82f6");
  const rgb = useMemo(() => hexToRgb(hex), [hex]);

  const handleHexChange = (val: string) => {
    setHex(val);
    if (hexToRgb(val)) setHex(val);
  };

  const handleRgbChange = (r: number, g: number, b: number) => {
    setHex(rgbToHex(r, g, b));
  };

  const color = rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : "#3b82f6";
  const hsl = rgb ? rgbToHsl(...rgb) : [0, 0, 0];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">拾色器</label>
          <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-20 h-20 rounded-lg border border-gray-300 cursor-pointer" />
        </div>

        <div className="flex-1 space-y-3 min-w-[240px]">
          <div>
            <label className="block text-xs text-gray-500 font-medium mb-1">HEX</label>
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {rgb && (
            <>
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">
                  RGB ({rgb[0]}, {rgb[1]}, {rgb[2]})
                </label>
                <div className="flex gap-2">
                  {["R", "G", "B"].map((ch, i) => (
                    <div key={ch} className="flex-1">
                      <div className="text-xs text-gray-400 mb-1">{ch}</div>
                      <input
                        type="range"
                        min={0} max={255}
                        value={rgb[i]}
                        onChange={(e) => {
                          const n = [...rgb];
                          n[i] = Number(e.target.value);
                          handleRgbChange(n[0], n[1], n[2]);
                        }}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">
                  HSL ({hsl[0]}&deg;, {hsl[1]}%, {hsl[2]}%)
                </label>
              </div>
            </>
          )}
        </div>

        <div className="w-24 h-24 rounded-lg border border-gray-300 flex-shrink-0" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
