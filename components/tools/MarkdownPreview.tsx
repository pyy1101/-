"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

const defaultMd = `# Markdown 预览

## 功能演示

这是一款**在线** Markdown 编辑器。

### 列表演示

- 项目一
- 项目二
  - 嵌套项目
- 项目三

### 代码演示

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

### 其它

> 这是一段引用文字

[链接示例](https://example.com)

| 表头1 | 表头2 |
|-------|-------|
| 单元格 | 单元格 |

---

感谢使用！`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useLocalStorage("tool-markdown-input", defaultMd);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!markdown.trim()) { setHtml(""); return; }
    let cancelled = false;
    (async () => {
      try {
        const [{ marked }, DOMPurify] = await Promise.all([
          import("marked"),
          import("dompurify"),
        ]);
        if (cancelled) return;
        const raw = marked.parse(markdown, { breaks: true, gfm: true }) as string;
        const sanitized = DOMPurify.default.sanitize(raw, {
          ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "ul", "ol", "li", "blockquote", "pre", "code", "em", "strong", "del", "a", "img", "table", "thead", "tbody", "tr", "th", "td", "input"],
          ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class", "checked", "type", "disabled"],
        });
        if (!cancelled) setHtml(sanitized);
      } catch { if (!cancelled) setHtml(""); }
    })();
    return () => { cancelled = true; };
  }, [markdown]);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">Markdown 输入</label>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-[500px] p-4 border border-[var(--color-border)] rounded-lg font-mono text-sm resize-y bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="block text-xs text-[var(--color-text-dim)] font-medium mb-1">实时预览</label>
        <div
          className="w-full h-[500px] p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] overflow-y-auto overflow-x-hidden"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
