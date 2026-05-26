"use client";

import { useState } from "react";

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [originalSize, setOriginalSize] = useState(0);

  const minify = () => {
    setOriginalSize(new TextEncoder().encode(input).length);
    let css = input
      .replace(/\/\*[\s\S]*?\*\//g, "")  // remove comments
      .replace(/\s+/g, " ")               // collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, "$1")  // remove space around brackets
      .replace(/;}/g, "}")                // remove last semicolon
      .replace(/^\s+|\s+$/g, "")          // trim
      .replace(/0(\.\d+)px/g, "$1px");    // 0.x → .x
    setOutput(css);
  };

  const saved = output ? Math.max(0, Math.round((1 - output.length / input.length) * 100)) : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={minify} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">压缩 CSS</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">复制</button>}
        {output && <span className="text-sm text-gray-500 py-2">{originalSize.toLocaleString()} bytes → {new TextEncoder().encode(output).length.toLocaleString()} bytes (减小 {saved}%)</span>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="body { margin: 0px; padding: 0px; }" spellCheck={false} />
        <textarea value={output} readOnly className="w-full h-80 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-gray-50 outline-none" spellCheck={false} />
      </div>
    </div>
  );
}
