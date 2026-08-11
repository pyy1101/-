"use client";

import { useState } from "react";
import Link from "next/link";
import { getToolBySlug } from "@/lib/tools";
import toolComponents from "@/lib/registry";
import AdBanner from "@/components/AdBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

export default function ToolPageClient({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  const { show: toast } = useToast();
  const [shared, setShared] = useState(false);
  if (!tool) return null;

  const Component = toolComponents[slug];
  const url = `https://www.devshells.com/${slug}`;

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tool.name + " — 免费在线开发工具")}&url=${encodeURIComponent(url)}`, "_blank", "noopener");
  };

  const copyLink = () => {
    if (copyToClipboard(url)) {
      setShared(true);
      toast("链接已复制");
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-faint)] mb-6" aria-label="面包屑导航">
        <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">首页</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/en/${slug}`} className="hover:text-[var(--color-accent)] transition-colors">English</Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--color-text-dim)]">{tool.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">{tool.name}</h1>
              <p className="text-[var(--color-text-dim)] text-sm">{tool.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={shareTwitter} aria-label="分享到 Twitter" className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">分享</button>
              <button onClick={copyLink} aria-label="复制链接" className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">{shared ? "已复制" : "复制链接"}</button>
            </div>
          </div>

          {Component ? <ErrorBoundary toolSlug={slug}><Component /></ErrorBoundary> : <p className="text-[var(--color-text-faint)] py-12 text-center">工具组件开发中...</p>}

          <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">关于{tool.name}</h2>
            <p className="text-[var(--color-text-dim)] leading-relaxed text-sm">{tool.usage}</p>
          </section>
        </div>

        <aside className="w-full lg:w-72 flex-shrink-0" aria-label="侧边栏广告">
          <div className="sticky top-20 space-y-6">
            <AdBanner slot="sidebar" className="min-h-[250px]" />
          </div>
        </aside>
      </div>

      <AdBanner slot="bottom" className="mt-10" />
    </div>
  );
}
