"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/lib/theme";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { resolved, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolved === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-header-bg)] backdrop-blur border-b border-[var(--color-border-secondary)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-[var(--color-accent)] hover:brightness-110">
          <span className="text-2xl">🔧</span>
          <span>DevShells</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-5 text-sm text-[var(--color-text-dim)]">
            <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">中文</Link>
            <Link href="/en" className="hover:text-[var(--color-accent)] transition-colors">English</Link>
            <Link href="/privacy" className="hover:text-[var(--color-accent)] transition-colors">隐私政策</Link>
          </nav>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-[var(--color-text-dim)] hover:bg-[var(--color-muted)] transition-colors"
            aria-label={resolved === "dark" ? "切换浅色模式" : "切换深色模式"}
          >
            {resolved === "dark" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button
            className="md:hidden p-2 text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border-light)] bg-[var(--color-bg-primary)] px-4 py-3 space-y-2">
          <Link href="/" className="block text-sm text-[var(--color-text-dim)] hover:text-[var(--color-accent)] py-1" onClick={() => setMenuOpen(false)}>中文</Link>
          <Link href="/en" className="block text-sm text-[var(--color-text-dim)] hover:text-[var(--color-accent)] py-1" onClick={() => setMenuOpen(false)}>English</Link>
          <Link href="/privacy" className="block text-sm text-[var(--color-text-dim)] hover:text-[var(--color-accent)] py-1" onClick={() => setMenuOpen(false)}>隐私政策</Link>
        </div>
      )}
    </header>
  );
}
