"use client";

import { useState } from "react";
import { getAllTools, searchTools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import AdBanner from "@/components/AdBanner";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const tools = query ? searchTools(query) : getAllTools();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          免费在线开发工具
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          所有工具纯前端运行，数据不上传服务器，安全高效
        </p>
      </section>

      <section className="mb-8">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="搜索工具..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </section>

      <AdBanner slot="top" className="mb-8" />

      {tools.length === 0 ? (
        <p className="text-center text-gray-400 py-12">没有找到匹配的工具</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}

      <AdBanner slot="bottom" className="mt-8" />
    </div>
  );
}
