"use client";

import { useState } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  const test = () => {
    setError("");
    setMatches([]);
    try {
      const re = new RegExp(pattern, flags);
      const result = [...text.matchAll(re)];
      setMatches(result.map((m) => m[0]));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const highlight = () => {
    if (!pattern || !text) return text;
    try {
      const re = new RegExp(pattern, flags);
      return text.replace(re, (match) => `<mark class="bg-yellow-200 rounded px-0.5">${match}</mark>`);
    } catch {
      return text;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 font-medium mb-1">正则表达式</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-mono text-sm">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex-1 px-3 py-2 border-y border-gray-300 font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              placeholder="\\d+"
            />
            <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 font-mono text-sm">/</span>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">标志</label>
          <select value={flags} onChange={(e) => setFlags(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-mono">
            <option value="g">g</option>
            <option value="gi">gi</option>
            <option value="gm">gm</option>
            <option value="gim">gim</option>
          </select>
        </div>
        <button onClick={test} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">测试</button>
      </div>

      <div>
        <label className="block text-xs text-gray-500 font-medium mb-1">测试文本</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入测试文本..."
          spellCheck={false}
        />
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{error}</div>}

      {matches.length > 0 && (
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">匹配结果 ({matches.length})</label>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-60 overflow-y-auto space-y-1">
            {matches.map((m, i) => (
              <div key={i} className="font-mono text-sm text-green-800">
                [{i + 1}] &quot;{m}&quot;
              </div>
            ))}
          </div>
        </div>
      )}

      {pattern && text && (
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">高亮预览</label>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm leading-relaxed break-all" dangerouslySetInnerHTML={{ __html: highlight() }} />
        </div>
      )}
    </div>
  );
}
