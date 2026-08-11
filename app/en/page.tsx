"use client";

import { useState } from "react";
import { getAllTools, searchTools, getCategories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import AdBanner from "@/components/AdBanner";

export default function EnHomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const categories = getCategories();
  const raw = query || category !== "全部" ? searchTools(query, category) : getAllTools();
  const tools = [...raw].sort((a, b) => (a.popular === b.popular ? 0 : a.popular ? -1 : 1));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-3">
          Free Online Developer Tools
        </h1>
        <p className="text-[var(--color-text-dim)] text-lg max-w-xl mx-auto">
          All tools run entirely in your browser — no data leaves your device
        </p>
      </section>

      <section className="mb-6">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-text)] placeholder-[var(--color-text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent shadow-sm"
          />
        </div>
      </section>

      <section className="mb-6">
        <div className="flex gap-2 justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => { setCategory(cat.key); setQuery(""); }}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${category === cat.key ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text-dim)] hover:brightness-95"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <AdBanner slot="top" className="mb-8" />

      {tools.length === 0 ? (
        <p className="text-center text-[var(--color-text-faint)] py-12">No tools found</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} lang="en" />
          ))}
        </div>
      )}

      <AdBanner slot="bottom" className="mt-8" />
    </div>
  );
}
