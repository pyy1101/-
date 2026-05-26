"use client";

import { useState } from "react";
import { getAllTools, searchTools } from "@/lib/tools";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";

export default function EnHomePage() {
  const [query, setQuery] = useState("");
  const tools = query
    ? searchTools(query)
    : getAllTools();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Free Online Developer Tools
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          All tools run entirely in your browser — no data leaves your device
        </p>
      </section>

      <section className="mb-8">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </section>

      <AdBanner slot="top" className="mb-8" />

      {tools.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No tools found</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/en/${tool.slug}`}
              className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-lg group-hover:bg-blue-100 transition-colors">
                  {tool.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    {tool.nameEn}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{tool.descriptionEn}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AdBanner slot="bottom" className="mt-8" />
    </div>
  );
}
