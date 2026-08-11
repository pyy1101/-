"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  timezone?: string;
}

let cachedInfo: IpInfo | null = null;

export default function IpLookup() {
  const [ip, setIp] = useLocalStorage("tool-ip-input", "");
  const [info, setInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookupMine = useCallback(async () => {
    if (cachedInfo) { setInfo(cachedInfo); setIp(cachedInfo.ip); return; }
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
  }, []);

  const lookupIp = useCallback(async (targetIp: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://ipapi.co/${targetIp}/json/`);
      const data = await res.json();
      if (data.error) throw new Error(data.reason);
      const result: IpInfo = {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        org: data.org,
        timezone: data.timezone,
      };
      setInfo(result);
      setIp(data.ip);
      cachedInfo = result;
    } catch {
      setError("查询失败，请检查 IP 地址");
      setInfo(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { lookupMine(); }, [lookupMine]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-[var(--color-border)] rounded-lg font-mono text-sm bg-[var(--color-input)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="输入 IP 地址"
        />
        <button onClick={() => lookupIp(ip)} disabled={loading || !ip} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50">
          {loading ? "查询中..." : "查询"}
        </button>
        <button onClick={lookupMine} className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm hover:bg-[var(--color-muted)] text-[var(--color-text-dim)]">我的 IP</button>
      </div>

      {error && <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg p-3 text-sm text-[var(--color-error-text)]">{error}</div>}

      {info && (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg overflow-hidden">
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
                <tr key={label} className="border-b border-[var(--color-border-light)] last:border-0">
                  <td className="px-4 py-3 text-[var(--color-text-dim)] font-medium w-24">{label}</td>
                  <td className="px-4 py-3 text-[var(--color-text)] font-mono">{value || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
