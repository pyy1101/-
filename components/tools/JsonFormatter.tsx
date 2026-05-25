"use client";

import { useState, useCallback } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, indent]);

  const compress = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={format} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">格式化</button>
        <button onClick={compress} className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">压缩</button>
        <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option value={2}>缩进 2</option>
          <option value={4}>缩进 4</option>
        </select>
        {output && (
          <button onClick={copyOutput} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">复制结果</button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">输入 JSON</label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            className="w-full h-80 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='{"hello": "world"}'
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">输出结果</label>
          <textarea
            value={error ? error : output}
            readOnly
            className={`w-full h-80 p-3 border rounded-lg font-mono text-sm resize-y bg-gray-50 outline-none ${error ? "border-red-300 text-red-600" : "border-gray-300"}`}
            placeholder="点击格式化查看结果"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
