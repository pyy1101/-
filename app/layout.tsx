import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const GA_ID = "G-XXXXXXXXXX"; // 替换为你的 Google Analytics ID

export const metadata: Metadata = {
  title: {
    default: "DevShells — 免费在线开发工具",
    template: "%s | DevShells",
  },
  description: "免费在线开发工具集合，JSON格式化、Base64编解码、字数统计、时间戳转换、UUID生成、颜色选择、Markdown预览、图片压缩等实用在线工具",
  keywords: ["在线工具", "开发工具", "JSON格式化", "Base64", "时间戳", "UUID生成器", "二维码", "正则表达式"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        {/* 百度统计 */}
        <Script id="baidu-tongji" strategy="afterInteractive">
          {`
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?0532d2564af1de20fe063931ae5e7bca";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
