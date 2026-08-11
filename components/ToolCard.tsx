import Link from "next/link";
import type { ToolMeta } from "@/lib/tools";

export default function ToolCard({ tool, lang = "zh" }: { tool: ToolMeta; lang?: "zh" | "en" }) {
  const name = lang === "en" ? tool.nameEn : tool.name;
  const description = lang === "en" ? tool.descriptionEn : tool.description;
  const href = lang === "en" ? `/en/${tool.slug}` : `/${tool.slug}`;
  const hotLabel = lang === "en" ? "Hot" : "热门";

  return (
    <Link
      href={href}
      className="group block bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-accent)] hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)] font-bold text-lg group-hover:brightness-95 transition-colors">
          {tool.icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-1 flex items-center gap-2">
            {name}
            {tool.popular && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-popular)] text-[var(--color-popular-text)] font-medium leading-none">{hotLabel}</span>}
          </h3>
          <p className="text-sm text-[var(--color-text-dim)] leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}
