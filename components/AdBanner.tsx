"use client";

import { ADSENSE_CLIENT_ID, AD_SLOTS, ADSENSE_ENABLED } from "@/lib/adsense";

interface AdBannerProps {
  slot: keyof typeof AD_SLOTS;
  className?: string;
}

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
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

  return <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={ADSENSE_CLIENT_ID} data-ad-slot={AD_SLOTS[slot]} data-ad-format="auto" data-full-width-responsive="true" />;
}
