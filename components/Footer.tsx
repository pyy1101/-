import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div>
          &copy; {new Date().getFullYear()} DevTools — 免费在线开发工具
        </div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-gray-700 transition-colors">隐私政策</Link>
          <Link href="/" className="hover:text-gray-700 transition-colors">全部工具</Link>
        </div>
      </div>
    </footer>
  );
}
