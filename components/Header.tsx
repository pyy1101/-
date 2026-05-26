"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 hover:text-blue-700">
          <span className="text-2xl">🔧</span>
          <span>DevShells</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">中文</Link>
          <Link href="/en" className="hover:text-blue-600 transition-colors">English</Link>
          <Link href="/privacy" className="hover:text-blue-600 transition-colors">隐私政策</Link>
        </nav>

        <button
          className="md:hidden p-2 text-gray-500 hover:text-gray-700"
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

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link href="/" className="block text-sm text-gray-600 hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>中文</Link>
          <Link href="/en" className="block text-sm text-gray-600 hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>English</Link>
          <Link href="/privacy" className="block text-sm text-gray-600 hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>隐私政策</Link>
        </div>
      )}
    </header>
  );
}
