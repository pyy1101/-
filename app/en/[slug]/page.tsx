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

  return {
    title: tool.nameEn,
    description: tool.descriptionEn,
    keywords: tool.keywordsEn,
    openGraph: {
      title: `${tool.nameEn} — DevShells`,
      description: tool.descriptionEn,
      type: "website",
      locale: "en_US",
    },
  };
}

export default async function EnToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return <EnToolPageClient slug={slug} />;
}
