import type { ComponentType } from "react";

export interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  icon: string;
}

const toolMetaList: ToolMeta[] = [
  {
    slug: "json-formatter",
    name: "JSON 格式化",
    description: "在线 JSON 格式化、压缩、校验工具，支持语法错误高亮提示",
    keywords: ["json", "格式化", "美化", "压缩", "校验", "json formatter"],
    icon: "{ }",
  },
  {
    slug: "base64",
    name: "Base64 编解码",
    description: "在线 Base64 编码解码工具，支持中文和 Unicode",
    keywords: ["base64", "编码", "解码", "encode", "decode"],
    icon: "64",
  },
  {
    slug: "word-counter",
    name: "字数统计",
    description: "实时统计字符数、单词数、行数、段落数，支持中英文混排",
    keywords: ["字数统计", "字符计数", "单词", "行数", "word counter"],
    icon: "W",
  },
  {
    slug: "timestamp",
    name: "Unix 时间戳转换",
    description: "Unix 时间戳与日期时间在线互转，支持秒/毫秒级精度",
    keywords: ["时间戳", "unix timestamp", "日期转换", "timestamp converter"],
    icon: "T",
  },
  {
    slug: "uuid-generator",
    name: "UUID 生成器",
    description: "在线批量生成 UUID v4，一键复制，支持大小写切换",
    keywords: ["uuid", "guid", "生成器", "随机id", "uuid generator"],
    icon: "ID",
  },
  {
    slug: "color-picker",
    name: "颜色选择器",
    description: "在线拾色器，支持 HEX/RGB/HSL 色值实时互转",
    keywords: ["颜色", "取色器", "color picker", "hex", "rgb", "hsl"],
    icon: "#",
  },
  {
    slug: "markdown-preview",
    name: "Markdown 预览",
    description: "在线 Markdown 编辑器，左边编辑右边实时预览",
    keywords: ["markdown", "预览", "编辑器", "md", "preview"],
    icon: "M↓",
  },
  {
    slug: "image-compress",
    name: "图片压缩",
    description: "在线图片压缩工具，纯前端压缩不泄露隐私，支持 JPG/PNG/WebP",
    keywords: ["图片压缩", "image compress", "压缩", "jpg", "png", "webp"],
    icon: "img",
  },
  {
    slug: "url-encoder",
    name: "URL 编码解码",
    description: "在线 URL 编码解码工具，支持 encodeURIComponent 和 decodeURIComponent",
    keywords: ["url编码", "url解码", "url encode", "url decode", "百分号编码"],
    icon: "%",
  },
  {
    slug: "hash-generator",
    name: "哈希生成器",
    description: "在线 MD5/SHA-1/SHA-256/SHA-512 哈希值生成，支持任意文本输入",
    keywords: ["md5", "sha1", "sha256", "sha512", "哈希", "hash", "加密"],
    icon: "#=",
  },
  {
    slug: "regex-tester",
    name: "正则表达式测试",
    description: "在线正则表达式测试工具，实时匹配高亮，支持所有 JS 正则语法",
    keywords: ["正则", "regex", "regexp", "正则表达式", "匹配", "regex tester"],
    icon: ".*",
  },
  {
    slug: "qr-code",
    name: "二维码生成器",
    description: "在线二维码生成工具，输入文本/网址生成高清二维码，支持 PNG 下载",
    keywords: ["二维码", "qrcode", "qr code", "生成器", "二维码生成"],
    icon: "QR",
  },
  {
    slug: "diff-checker",
    name: "文本差异对比",
    description: "在线文本差异对比工具，比对两段文本的增删改行，类 Git diff",
    keywords: ["diff", "对比", "差异", "比较", "文本对比", "diff checker"],
    icon: "<>",
  },
  {
    slug: "ip-lookup",
    name: "IP 地址查询",
    description: "在线 IP 地址归属地查询，支持查询任意 IP 的国家/城市/运营商信息",
    keywords: ["ip查询", "ip地址", "归属地", "ip lookup", "我的ip"],
    icon: "IP",
  },
];

export function getAllTools(): ToolMeta[] {
  return toolMetaList;
}

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return toolMetaList.find((t) => t.slug === slug);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase();
  return toolMetaList.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
