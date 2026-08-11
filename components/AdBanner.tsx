"use client";

import { useEffect, useRef, useState } from "react";
import { ADSENSE_ENABLED } from "@/lib/adsense";

interface AdBannerProps {
  slot: "top" | "sidebar" | "bottom";
  className?: string;
}

const AD_CONFIG = {
  top: { key: "cf1b663b00c8ff37e1ef479c73a076ca", height: 90, width: 728 },
  sidebar: { key: "54a904c47048e64d427a89b8749d20c8", height: 250, width: 300 },
  bottom: { key: "cf1b663b00c8ff37e1ef479c73a076ca", height: 90, width: 728 },
};

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ADSENSE_ENABLED) return;

    const cfg = AD_CONFIG[slot];
    const container = containerRef.current;
    if (!container || container.querySelector("iframe")) return;

    const atOpt = document.createElement("script");
    atOpt.textContent = `atOptions = {'key':'${cfg.key}','format':'iframe','height':${cfg.height},'width':${cfg.width},'params':{}};`;

    const invoke = document.createElement("script");
    invoke.src = `https://www.highperformanceformat.com/${cfg.key}/invoke.js`;
    invoke.onload = () => setLoaded(true);
    invoke.onerror = () => setLoaded(true); // still hide placeholder on error

    container.appendChild(atOpt);
    container.appendChild(invoke);
  }, [slot]);

  if (!ADSENSE_ENABLED) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--color-muted)] border border-dashed border-[var(--color-border)] rounded-lg text-[var(--color-text-faint)] text-sm ${className}`}
        style={{ minHeight: slot === "sidebar" ? 250 : 90 }}
      >
        Ad — {slot}
      </div>
    );
  }

  const minH = slot === "sidebar" ? 250 : 90;

  return (
    <div className={`relative ${className}`} style={{ minHeight: minH }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-muted)] border border-dashed border-[var(--color-border)] rounded-lg text-[var(--color-text-faint)] text-sm">
          Loading ad...
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}
