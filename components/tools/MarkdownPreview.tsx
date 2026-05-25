"use client";

import { useState } from "react";

const defaultMd = `# Markdown 预览

## 功能演示

这是一款**在线** Markdown 编辑器。

### 列表演示

- 项目一
- 项目二
- 项目三

### 代码演示

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

### 其它

> 这是一段引用文字

[链接示例](https://example.com)

---

感谢使用！`;

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-xl font-semibold mt-5 mb-2'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class='bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-600'>$1</code>")
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre class='bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm my-3'><code>$2</code></pre>")
    .replace(/^> (.+)$/gm, "<blockquote class='border-l-4 border-blue-400 pl-4 text-gray-600 my-3'>$1</blockquote>")
    .replace(/^---$/gm, "<hr class='my-4 border-gray-300'>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2' class='text-blue-600 hover:underline' target='_blank'>$1</a>")
    .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
    .replace(/\n\n/g, "</p><p class='mb-3'>")
    .replace(/\n/g, "<br>");

  html = "<p class='mb-3'>" + html + "</p>";
  return html;
}

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(defaultMd);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs text-gray-500 font-medium mb-1">Markdown 输入</label>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 font-medium mb-1">实时预览</label>
        <div
          className="w-full h-[500px] p-4 border border-gray-300 rounded-lg bg-white overflow-y-auto text-sm text-gray-800 leading-relaxed overflow-x-hidden"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      </div>
    </div>
  );
}
