"use client";

import { useState, useCallback } from "react";

function generateUUIDv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>(() => [generateUUIDv4()]);
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);

  const generate = useCallback(() => {
    const list = Array.from({ length: count }, () => generateUUIDv4());
    setUuids(list);
  }, [count]);

  const display = (uuid: string) => (uppercase ? uuid.toUpperCase() : uuid.toLowerCase());

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.map(display).join("\n"));
  };

  const copyOne = (uuid: string) => {
    navigator.clipboard.writeText(display(uuid));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <label className="text-sm text-gray-600">生成数量：</label>
        <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value) || 1)))} className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">生成</button>
        <label className="flex items-center gap-1 text-sm text-gray-600 ml-2">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded" />
          大写
        </label>
        {uuids.length > 0 && (
          <button onClick={copyAll} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 ml-auto">复制全部</button>
        )}
      </div>

      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 group hover:border-blue-200 transition-colors">
            <span className="text-xs text-gray-400 font-mono w-6">{i + 1}.</span>
            <code className="flex-1 font-mono text-sm text-gray-800 break-all">{display(uuid)}</code>
            <button onClick={() => copyOne(uuid)} className="flex-shrink-0 px-3 py-1 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100">
              复制
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
