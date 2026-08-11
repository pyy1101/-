"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useDebounce } from "@/lib/useDebounce";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";
import { useToast } from "@/components/Toast";
import { copyToClipboard } from "@/lib/clipboard";

function htmlToMd(html: string): string {
  let md = html;
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => "\n# " + stripTags(t).trim() + "\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => "\n## " + stripTags(t).trim() + "\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => "\n### " + stripTags(t).trim() + "\n");
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => "\n#### " + stripTags(t).trim() + "\n");
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => "\n##### " + stripTags(t).trim() + "\n");
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, t) => "\n###### " + stripTags(t).trim() + "\n");
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*");
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");
  md = md.replace(/<pre[^>]*>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/gi, (_, t) => "\n```\n" + decodeEntities(t).trim() + "\n```\n");
  md = md.replace(/<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img[^>]*src\s*=\s*["']([^"']*)["'][^>]*alt\s*=\s*["']([^"']*)["'][^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*src\s*=\s*["']([^"']*)["'][^>]*\/?>/gi, "![]($1)");
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => "\n> " + stripTags(t).trim().replace(/\n/g, "\n> ") + "\n");
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => "- " + stripTags(t).trim());
  md = md.replace(/<\/?[ou]l[^>]*>/gi, "");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => "\n" + stripTags(t).trim() + "\n");
  md = md.replace(/<[^>]+>/g, "");
  md = md.replace(/&nbsp;/g, " ");
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&lt;/g, "<");
  md = md.replace(/&gt;/g, ">");
  md = md.replace(/&quot;/g, "\"");
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/\n{3,}/g, "\n\n");
  md = md.trim();
  return md;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
}

function decodeEntities(text: string): string {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'");
}

export default function HtmlToMarkdown() {
  const [input, setInput] = useLocalStorage("tool-html2md-input", "");
  const [output, setOutput] = useState("");
  const { show: toast } = useToast();
  const debouncedInput = useDebounce(input, 400);

  const convert = () => {
    if (!debouncedInput.trim()) { setOutput(""); return; }
    setOutput(htmlToMd(debouncedInput));
  };

  useEffect(() => { convert(); }, [debouncedInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useKeyboardShortcut("Enter", convert);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={convert} disabled={!input.trim()} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50">转换</button>
        <button onClick={() => { setInput(""); setOutput(""); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] transition-colors text-[var(--color-text-dim)]">清空</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">HTML 输入</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-96 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" spellCheck={false} placeholder="<h1>标题</h1><p>段落</p>..." />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">Markdown 输出</label>
          <textarea value={output} readOnly className="w-full h-96 p-3 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-output)] text-[var(--color-text)] outline-none" spellCheck={false} />
        </div>
      </div>

      {output && (
        <button onClick={() => { if (copyToClipboard(output)) toast("已复制到剪贴板"); }} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">复制结果</button>
      )}
    </div>
  );
}
