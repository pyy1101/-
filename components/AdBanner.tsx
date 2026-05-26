"use client";

import { useEffect, useRef } from "react";
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

const SCRIPT_LOADED = { current: false };

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ADSENSE_ENABLED) return;

    const cfg = AD_CONFIG[slot];
    const container = containerRef.current;
    if (!container || container.querySelector("iframe")) return;

    const atOpt = document.createElement("script");
    atOpt.textContent = `atOptions = {'key':'${cfg.key}','format':'iframe','height':${cfg.height},'width':${cfg.width},'params':{}};`;
    container.appendChild(atOpt);

    const invoke = document.createElement("script");
    invoke.src = "https://www.highperformanceformat.com/cf1b663b00c8ff37e1ef479c73a076ca/invoke.js";
    container.appendChild(invoke);
  }, [slot]);

  if (!ADSENSE_ENABLED) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm ${className}`}
        style={{ minHeight: slot === "sidebar" ? 250 : 90 }}
      >
        Ad — {slot}
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
