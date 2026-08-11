import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTools, getToolBySlug } from "@/lib/tools";
import EnToolPageClient from "./ToolPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };

  const seoTitle = `Free Online ${tool.nameEn} | DevShells`;
  const seoDesc = `${tool.descriptionEn} ${tool.usageEn.slice(0, 80)}`;

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: tool.keywordsEn,
    alternates: {
      canonical: `https://www.devshells.com/en/${slug}`,
      languages: { zh: `https://www.devshells.com/${slug}` },
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://www.devshells.com/en/${slug}`,
      siteName: "DevShells",
      type: "website",
      locale: "en_US",
      alternateLocale: "zh_CN",
    },
    twitter: {
      card: "summary",
      title: seoTitle,
      description: seoDesc,
    },
  };
}

export default async function EnToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.nameEn} — DevShells`,
    url: `https://www.devshells.com/en/${slug}`,
    description: tool.descriptionEn,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    inLanguage: ["en-US", "zh-CN"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EnToolPageClient slug={slug} />
    </>
  );
}
