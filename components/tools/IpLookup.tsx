"use client";

import { useState, useEffect } from "react";

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  timezone?: string;
}

export default function IpLookup() {
  const [ip, setIp] = useState("");
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    lookupMine();
  }, []);

  const lookupMine = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setIp(data.ip);
      await lookupIp(data.ip);
    } catch {
      setError("获取 IP 失败，请手动输入查询");
      setLoading(false);
    }
  };

  const lookupIp = async (targetIp: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://ipapi.co/${targetIp}/json/`);
      const data = await res.json();
      if (data.error) throw new Error(data.reason);
      setInfo({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        org: data.org,
        timezone: data.timezone,
      });
      setIp(data.ip);
    } catch {
      setError("查询失败，请检查 IP 地址");
      setInfo(null);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入 IP 地址"
        />
        <button onClick={() => lookupIp(ip)} disabled={loading || !ip} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {loading ? "查询中..." : "查询"}
        </button>
        <button onClick={lookupMine} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">我的 IP</button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{error}</div>}

      {info && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {[
                ["IP 地址", info.ip],
                ["国家", info.country],
                ["地区", info.region],
                ["城市", info.city],
                ["运营商", info.org],
                ["时区", info.timezone],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-500 font-medium w-24">{label}</td>
                  <td className="px-4 py-3 text-gray-800 font-mono">{value || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
