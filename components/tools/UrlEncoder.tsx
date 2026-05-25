"use client";

import { useState, useMemo } from "react";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput("解码失败，请检查输入");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setMode("encode"); setOutput(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "encode" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>编码 Encode</button>
        <button onClick={() => { setMode("decode"); setOutput(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "decode" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>解码 Decode</button>
        <button onClick={convert} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">转换</button>
        {output && (
          <>
            <button onClick={swap} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">交换</button>
            <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">复制结果</button>
          </>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">{mode === "encode" ? "输入文本" : "输入 URL 编码"}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" spellCheck={false} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1">输出结果</label>
          <textarea value={output} readOnly className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-gray-50 outline-none" spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
