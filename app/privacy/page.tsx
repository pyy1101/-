import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "DevTools 隐私政策",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 prose prose-gray">
      <h1 className="text-3xl font-bold mb-6">隐私政策</h1>
      <p className="text-sm text-gray-500 mb-8">最后更新日期：{new Date().toISOString().split("T")[0]}</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">信息收集</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        DevTools 是一个纯前端工具站点。所有工具的处理逻辑都在您的浏览器中运行，<strong>我们不会上传、收集或存储您输入的任何数据</strong>。
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        我们使用 Google Analytics 分析网站流量，并使用 Google AdSense 展示广告。这些第三方服务可能会通过 Cookie 收集匿名访问数据。
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Cookie 和广告</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Google AdSense 使用 Cookie 来展示个性化广告。您可以随时通过浏览器设置禁用 Cookie。欧洲用户可以管理广告偏好设置。
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        第三方供应商（包括 Google）使用 Cookie 根据用户先前访问我们网站或其他网站的情况来展示广告。Google 使用广告 Cookie 使其及其合作伙伴能够根据用户访问我们网站和/或互联网上其他网站的情况向其展示广告。
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">数据安全</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        由于所有数据处理均在本地浏览器中进行，您的使用数据不会传输到我们的服务器，因此不存在数据泄露的风险。特别是图片压缩、JSON 格式化等涉及内容处理的工具，您的数据完全保留在本地设备上。
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">联系我们</h2>
      <p className="text-gray-600 leading-relaxed">
        如果您对本隐私政策有任何疑问，请通过网站底部的联系信息与我们取得联系。
      </p>
    </div>
  );
}
