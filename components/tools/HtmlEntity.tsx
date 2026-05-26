"use client";

import { useState } from "react";

const entities: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  "`": "&#96;", "¢": "&cent;", "£": "&pound;", "¥": "&yen;", "€": "&euro;",
  "©": "&copy;", "®": "&reg;", "™": "&trade;",
};

export default function HtmlEntity() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => {
    if (mode === "encode") {
      setOutput(input.replace(/[&<>"'`¢£¥€©®™]/g, (c) => entities[c] || c));
    } else {
      const reversed: Record<string, string> = {};
      for (const [k, v] of Object.entries(entities)) reversed[v] = k;
      const all = Object.keys(reversed).sort((a, b) => b.length - a.length);
      let result = input;
      for (const entity of all) {
        result = result.split(entity).join(reversed[entity]);
      }
      // Also handle numeric entities
      result = result.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
      result = result.replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
      setOutput(result);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setMode("encode"); setOutput(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "encode" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>编码</button>
        <button onClick={() => { setMode("decode"); setOutput(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "decode" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>解码</button>
        <button onClick={convert} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">转换</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">复制</button>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={mode === "encode" ? '<div class="hello">World</div>' : '&lt;div class=&quot;hello&quot;&gt;World&lt;/div&gt;'} spellCheck={false} />
        <textarea value={output} readOnly className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-gray-50 outline-none" spellCheck={false} />
      </div>
    </div>
  );
}
