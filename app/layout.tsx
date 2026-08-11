import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const GA_ID = "G-LN5L09BCX9";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.devshells.com"),
  title: {
    default: "DevShells — 免费在线开发工具集合 | JSON格式化 Base64 时间戳 UUID",
    template: "%s | DevShells",
  },
  description: "DevShells 提供 30+ 免费在线开发工具：JSON格式化、Base64编解码、URL编码、时间戳转换、UUID生成、二维码生成、SQL格式化、JWT解析等。无需注册，打开即用，纯前端处理保护数据安全。",
  keywords: ["在线工具", "开发工具", "JSON格式化", "Base64", "时间戳", "UUID生成器", "二维码", "正则表达式", "SQL格式化", "JWT解析", "Markdown预览", "图片压缩", "Mermaid", "免费"],
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.devshells.com",
    languages: { zh: "/", en: "/en" },
  },
  openGraph: {
    title: "DevShells — 免费在线开发工具集合",
    description: "30+ 免费在线开发工具，JSON格式化、Base64编解码、时间戳转换、UUID生成、二维码生成等，打开即用",
    url: "https://www.devshells.com",
    siteName: "DevShells",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary",
    title: "DevShells — 免费在线开发工具集合",
    description: "30+ 免费在线开发工具，JSON格式化、Base64编解码、时间戳转换等，打开即用",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        {/* Theme anti-flicker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("devshells-theme")||"system";var d=t==="system"?window.matchMedia("(prefers-color-scheme:dark)").matches:t==="dark";if(d)document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {/* 百度统计 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?0532d2564af1de20fe063931ae5e7bca";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s);})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] antialiased">
        <Header />
        <main className="flex-1"><ToastProvider>{children}</ToastProvider></main>
        <Footer />
      </body>
    </html>
  );
}
