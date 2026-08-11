import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTools, getToolBySlug } from "@/lib/tools";
import ToolPageClient from "./ToolPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "工具未找到" };

  const seoTitle = `${tool.name}在线工具 — 免费${tool.name} | DevShells`;
  const seoDesc = `${tool.description}。${tool.usage.slice(0, 80)}`;

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: tool.keywords,
    alternates: {
      canonical: `https://www.devshells.com/${slug}`,
      languages: { en: `https://www.devshells.com/en/${slug}` },
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://www.devshells.com/${slug}`,
      siteName: "DevShells",
      type: "website",
      locale: "zh_CN",
      alternateLocale: "en_US",
    },
    twitter: {
      card: "summary",
      title: seoTitle,
      description: seoDesc,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} — DevShells`,
    url: `https://www.devshells.com/${slug}`,
    description: tool.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
    inLanguage: ["zh-CN", "en-US"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageClient slug={slug} />
    </>
  );
}
