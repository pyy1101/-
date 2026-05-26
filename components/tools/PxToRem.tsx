"use client";

import { useState } from "react";

export default function PxToRem() {
  const [px, setPx] = useState("16");
  const [rem, setRem] = useState("");
  const [base, setBase] = useState(16);

  const pxToRem = () => {
    const v = Number(px) / base;
    setRem(v % 1 === 0 ? String(v) : v.toFixed(3).replace(/0+$/, "").replace(/\.$/, ""));
  };

  const remToPx = () => {
    setPx(String(Number(rem) * base));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs text-gray-500 font-medium mb-1">根字体大小 (root font-size)</label>
        <input type="number" min={1} max={100} value={base} onChange={(e) => setBase(Number(e.target.value) || 16)} className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
        <span className="text-sm text-gray-500 ml-2">px（默认 16px）</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">PX → REM</label>
          <div className="flex gap-2">
            <input type="text" value={px} onChange={(e) => setPx(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="16" />
            <span className="text-sm text-gray-500 py-2">px</span>
          </div>
          <button onClick={pxToRem} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">转换 →</button>
          {rem && <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg font-mono text-sm text-green-800">{rem} rem</div>}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">REM → PX</label>
          <div className="flex gap-2">
            <input type="text" value={rem} onChange={(e) => setRem(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1" />
            <span className="text-sm text-gray-500 py-2">rem</span>
          </div>
          <button onClick={remToPx} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">转换 →</button>
        </div>
      </div>
    </div>
  );
}
