export interface ToolMeta {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  keywords: string[];
  keywordsEn: string[];
  icon: string;
}

const toolMetaList: ToolMeta[] = [
  {
    slug: "json-formatter",
    name: "JSON 格式化",
    nameEn: "JSON Formatter",
    description: "在线 JSON 格式化、压缩、校验工具，支持语法错误高亮提示",
    descriptionEn: "Online JSON formatter, validator and compressor with syntax error highlighting",
    keywords: ["json", "格式化", "美化", "压缩", "校验", "json formatter"],
    keywordsEn: ["json formatter", "json validator", "json beautifier", "json minifier", "format json online"],
    icon: "{ }",
  },
  {
    slug: "base64",
    name: "Base64 编解码",
    nameEn: "Base64 Encoder/Decoder",
    description: "在线 Base64 编码解码工具，支持中文和 Unicode",
    descriptionEn: "Online Base64 encoder and decoder, supports Unicode and UTF-8",
    keywords: ["base64", "编码", "解码", "encode", "decode"],
    keywordsEn: ["base64 encode", "base64 decode", "base64 encoder", "base64 decoder", "base64 online"],
    icon: "64",
  },
  {
    slug: "url-encoder",
    name: "URL 编码解码",
    nameEn: "URL Encoder/Decoder",
    description: "在线 URL 编码解码工具，支持 encodeURIComponent 和 decodeURIComponent",
    descriptionEn: "Online URL encoder and decoder using encodeURIComponent and decodeURIComponent",
    keywords: ["url编码", "url解码", "url encode", "url decode", "百分号编码"],
    keywordsEn: ["url encode", "url decode", "url encoder", "url decoder", "percent encoding"],
    icon: "%",
  },
  {
    slug: "word-counter",
    name: "字数统计",
    nameEn: "Word Counter",
    description: "实时统计字符数、单词数、行数、段落数，支持中英文混排",
    descriptionEn: "Real-time character, word, line and paragraph counter with Chinese character support",
    keywords: ["字数统计", "字符计数", "单词", "行数", "word counter"],
    keywordsEn: ["word counter", "character count", "word count online", "character counter", "text statistics"],
    icon: "W",
  },
  {
    slug: "timestamp",
    name: "Unix 时间戳转换",
    nameEn: "Unix Timestamp Converter",
    description: "Unix 时间戳与日期时间在线互转，支持秒/毫秒级精度",
    descriptionEn: "Convert Unix timestamps to human-readable dates and vice versa",
    keywords: ["时间戳", "unix timestamp", "日期转换", "timestamp converter"],
    keywordsEn: ["unix timestamp", "timestamp converter", "epoch converter", "unix time online"],
    icon: "T",
  },
  {
    slug: "uuid-generator",
    name: "UUID 生成器",
    nameEn: "UUID Generator",
    description: "在线批量生成 UUID v4，一键复制，支持大小写切换",
    descriptionEn: "Batch generate UUID v4 online with one-click copy and uppercase option",
    keywords: ["uuid", "guid", "生成器", "随机id", "uuid generator"],
    keywordsEn: ["uuid generator", "guid generator", "uuid v4", "generate uuid online", "random uuid"],
    icon: "ID",
  },
  {
    slug: "color-picker",
    name: "颜色选择器",
    nameEn: "Color Picker",
    description: "在线拾色器，支持 HEX/RGB/HSL 色值实时互转",
    descriptionEn: "Online color picker with real-time HEX, RGB and HSL conversion",
    keywords: ["颜色", "取色器", "color picker", "hex", "rgb", "hsl"],
    keywordsEn: ["color picker", "hex to rgb", "rgb to hsl", "color converter", "online color picker"],
    icon: "#",
  },
  {
    slug: "markdown-preview",
    name: "Markdown 预览",
    nameEn: "Markdown Preview",
    description: "在线 Markdown 编辑器，左边编辑右边实时预览",
    descriptionEn: "Online Markdown editor with live preview — write on the left, preview on the right",
    keywords: ["markdown", "预览", "编辑器", "md", "preview"],
    keywordsEn: ["markdown preview", "markdown editor", "md preview", "markdown online", "markdown live"],
    icon: "M↓",
  },
  {
    slug: "image-compress",
    name: "图片压缩",
    nameEn: "Image Compressor",
    description: "在线图片压缩工具，纯前端压缩不泄露隐私，支持 JPG/PNG/WebP",
    descriptionEn: "Compress images in your browser — no upload, fully private. Supports JPG, PNG and WebP",
    keywords: ["图片压缩", "image compress", "压缩", "jpg", "png", "webp"],
    keywordsEn: ["image compressor", "compress image online", "compress jpg", "compress png", "reduce image size"],
    icon: "img",
  },
  {
    slug: "hash-generator",
    name: "哈希生成器",
    nameEn: "Hash Generator",
    description: "在线 MD5/SHA-1/SHA-256/SHA-512 哈希值生成，支持任意文本输入",
    descriptionEn: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes online for any text input",
    keywords: ["md5", "sha1", "sha256", "sha512", "哈希", "hash", "加密"],
    keywordsEn: ["md5 generator", "sha256 generator", "hash online", "md5 hash", "sha hash generator"],
    icon: "#=",
  },
  {
    slug: "regex-tester",
    name: "正则表达式测试",
    nameEn: "Regex Tester",
    description: "在线正则表达式测试工具，实时匹配高亮，支持所有 JS 正则语法",
    descriptionEn: "Test regular expressions online with real-time match highlighting and full JS regex support",
    keywords: ["正则", "regex", "regexp", "正则表达式", "匹配", "regex tester"],
    keywordsEn: ["regex tester", "regex online", "regex test", "regular expression tester", "regex matcher"],
    icon: ".*",
  },
  {
    slug: "qr-code",
    name: "二维码生成器",
    nameEn: "QR Code Generator",
    description: "在线二维码生成工具，输入文本/网址生成高清二维码，支持 PNG 下载",
    descriptionEn: "Generate high-quality QR codes from text or URLs with PNG download",
    keywords: ["二维码", "qrcode", "qr code", "生成器", "二维码生成"],
    keywordsEn: ["qr code generator", "qrcode generator", "qr code online", "generate qr code", "free qr code"],
    icon: "QR",
  },
  {
    slug: "diff-checker",
    name: "文本差异对比",
    nameEn: "Diff Checker",
    description: "在线文本差异对比工具，比对两段文本的增删改行，类 Git diff",
    descriptionEn: "Compare two texts and find differences — like Git diff for plain text",
    keywords: ["diff", "对比", "差异", "比较", "文本对比", "diff checker"],
    keywordsEn: ["diff checker", "text diff", "text compare", "diff online", "compare text"],
    icon: "<>",
  },
  {
    slug: "ip-lookup",
    name: "IP 地址查询",
    nameEn: "IP Lookup",
    description: "在线 IP 地址归属地查询，支持查询任意 IP 的国家/城市/运营商信息",
    descriptionEn: "Look up IP address geolocation — country, city, ISP, and timezone info",
    keywords: ["ip查询", "ip地址", "归属地", "ip lookup", "我的ip"],
    keywordsEn: ["ip lookup", "ip address lookup", "what is my ip", "ip geolocation", "ip location finder"],
    icon: "IP",
  },
  {
    slug: "json-to-csv",
    name: "JSON 转 CSV",
    nameEn: "JSON to CSV Converter",
    description: "在线 JSON 转 CSV 表格工具，支持嵌套数据展平，一键导出 CSV 文件",
    descriptionEn: "Convert JSON to CSV online with nested data flattening and CSV export",
    keywords: ["json转csv", "json to csv", "json", "csv", "转换"],
    keywordsEn: ["json to csv", "convert json to csv", "json to csv online", "json csv converter", "json to excel"],
    icon: "→",
  },
  {
    slug: "timer",
    name: "在线计时器",
    nameEn: "Online Timer",
    description: "在线倒计时和秒表工具，支持自定义时间，浏览器后台运行不中断",
    descriptionEn: "Online countdown timer and stopwatch — runs in background, never misses a beat",
    keywords: ["计时器", "倒计时", "秒表", "timer", "在线闹钟"],
    keywordsEn: ["online timer", "countdown timer", "stopwatch", "timer online", "countdown clock"],
    icon: "⏱️",
  },
  {
    slug: "css-minifier",
    name: "CSS 压缩",
    nameEn: "CSS Minifier",
    description: "在线 CSS 代码压缩工具，去除空白注释，大幅减小文件体积",
    descriptionEn: "Minify CSS online — strip whitespace and comments to reduce file size",
    keywords: ["css压缩", "css minify", "css压缩工具", "css", "代码压缩"],
    keywordsEn: ["css minifier", "minify css", "css compressor", "css minify online", "compress css"],
    icon: "C↓",
  },
  {
    slug: "html-entity",
    name: "HTML 实体编码",
    nameEn: "HTML Entity Encoder",
    description: "在线 HTML 实体编码解码工具，转义特殊字符，防止 XSS 攻击",
    descriptionEn: "Encode and decode HTML entities online — escape special characters and prevent XSS",
    keywords: ["html实体", "html entity", "编码", "解码", "转义", "xss"],
    keywordsEn: ["html entity encoder", "html entity decoder", "html escape", "html unescape", "html encode online"],
    icon: "<>",
  },
  {
    slug: "px-to-rem",
    name: "PX 转 REM",
    nameEn: "PX to REM Converter",
    description: "在线 PX 与 REM 互相转换工具，支持自定义根字体大小",
    descriptionEn: "Convert PX to REM and REM to PX online with customizable root font size",
    keywords: ["px转rem", "rem转px", "px rem", "css单位", "前端"],
    keywordsEn: ["px to rem", "rem to px", "px rem converter", "css units", "px to rem online"],
    icon: "↔",
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
      t.keywords.some((k) => k.toLowerCase().includes(q)) ||
      t.nameEn.toLowerCase().includes(q) ||
      t.descriptionEn.toLowerCase().includes(q) ||
      t.keywordsEn.some((k) => k.toLowerCase().includes(q))
  );
}
