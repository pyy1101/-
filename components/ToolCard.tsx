import Link from "next/link";
import type { ToolMeta } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-lg group-hover:bg-blue-100 transition-colors">
          {tool.icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
}
