import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — 页面未找到",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-6xl font-bold text-[var(--color-text-faint)] mb-4">404</h1>
      <p className="text-[var(--color-text-dim)] mb-6">页面未找到</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
