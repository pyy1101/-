"use client";

import Link from "next/link";
import { getToolBySlug } from "@/lib/tools";
import AdBanner from "@/components/AdBanner";
import JsonFormatter from "@/components/tools/JsonFormatter";
import Base64Tool from "@/components/tools/Base64Tool";
import WordCounter from "@/components/tools/WordCounter";
import TimestampConverter from "@/components/tools/TimestampConverter";
import UuidGenerator from "@/components/tools/UuidGenerator";
import ColorPicker from "@/components/tools/ColorPicker";
import MarkdownPreview from "@/components/tools/MarkdownPreview";
import ImageCompressor from "@/components/tools/ImageCompressor";
import UrlEncoder from "@/components/tools/UrlEncoder";
import HashGenerator from "@/components/tools/HashGenerator";
import RegexTester from "@/components/tools/RegexTester";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";
import DiffChecker from "@/components/tools/DiffChecker";
import IpLookup from "@/components/tools/IpLookup";
import JsonToCsv from "@/components/tools/JsonToCsv";
import Timer from "@/components/tools/Timer";
import CssMinifier from "@/components/tools/CssMinifier";
import HtmlEntity from "@/components/tools/HtmlEntity";
import PxToRem from "@/components/tools/PxToRem";

const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  "base64": Base64Tool,
  "url-encoder": UrlEncoder,
  "word-counter": WordCounter,
  "timestamp": TimestampConverter,
  "uuid-generator": UuidGenerator,
  "color-picker": ColorPicker,
  "markdown-preview": MarkdownPreview,
  "image-compress": ImageCompressor,
  "hash-generator": HashGenerator,
  "regex-tester": RegexTester,
  "qr-code": QrCodeGenerator,
  "diff-checker": DiffChecker,
  "ip-lookup": IpLookup,
  "json-to-csv": JsonToCsv,
  "timer": Timer,
  "css-minifier": CssMinifier,
  "html-entity": HtmlEntity,
  "px-to-rem": PxToRem,
};

export default function EnToolPageClient({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const Component = toolComponents[slug];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/en" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${slug}`} className="hover:text-blue-600 transition-colors">中文</Link>
        <span>/</span>
        <span className="text-gray-600">{tool.nameEn}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{tool.nameEn}</h1>
          <p className="text-gray-500 text-sm mb-6">{tool.descriptionEn}</p>

          {Component ? <Component /> : <p className="text-gray-400 py-12 text-center">Tool component loading...</p>}
        </div>

        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-20 space-y-6">
            <AdBanner slot="sidebar" className="min-h-[250px]" />
          </div>
        </aside>
      </div>

      <AdBanner slot="bottom" className="mt-10" />
    </div>
  );
}
