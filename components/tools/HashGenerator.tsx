"use client";

import { useState } from "react";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [algo, setAlgo] = useState("SHA-256");

  const generate = async () => {
    if (!input) return;
    try {
      if (algo === "MD5") {
        setOutput(md5(input));
      } else {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        setOutput(hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""));
      }
    } catch {
      setOutput("计算失败");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <select value={algo} onChange={(e) => setAlgo(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option value="MD5">MD5</option>
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-512">SHA-512</option>
        </select>
        <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">生成哈希</button>
        {output && (
          <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">复制</button>
        )}
      </div>
      <div>
        <label className="block text-xs text-gray-500 font-medium mb-1">输入文本</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="输入任意文本..." spellCheck={false} />
      </div>
      {output && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm break-all text-gray-800">{output}</div>
      )}
    </div>
  );
}

// Pure JS MD5 implementation
function md5(str: string): string {
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    const v = (a + q + x + t) >>> 0;
    return ((v << s) | (v >>> (32 - s))) + b;
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  const x: number[] = [];
  let k = 0;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    const c = str.charCodeAt(i);
    if (c < 128) x[k >> 2] |= c << (k % 4 * 8);
    else if (c < 2048) {
      x[k >> 2] |= (192 | c >> 6) << (k % 4 * 8);
      k += 1;
      x[k >> 2] |= (128 | c & 63) << (k % 4 * 8);
    } else if (c < 55296 || c > 56319) {
      x[k >> 2] |= (224 | c >> 12) << (k % 4 * 8);
      k += 1;
      x[k >> 2] |= (128 | c >> 6 & 63) << (k % 4 * 8);
      k += 1;
      x[k >> 2] |= (128 | c & 63) << (k % 4 * 8);
    } else {
      const cp = ((c - 55296) * 1024 + (str.charCodeAt(++i) - 56320) + 65536);
      x[k >> 2] |= (240 | cp >> 18) << (k % 4 * 8);
      k += 1;
      x[k >> 2] |= (128 | cp >> 12 & 63) << (k % 4 * 8);
      k += 1;
      x[k >> 2] |= (128 | cp >> 6 & 63) << (k % 4 * 8);
      k += 1;
      x[k >> 2] |= (128 | cp & 63) << (k % 4 * 8);
    }
    k += 1;
  }
  x[k >> 2] |= 128 << (k % 4 * 8);
  const tail = ((k + 64 >>> 9) << 4) + 14;
  x[tail] = k * 8;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d;
    a = ff(a, b, c, d, x[i], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = ii(a, b, c, d, x[i], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 2], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 9], 15, -1051523);
    b = ii(b, c, d, a, x[i + 16], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 3], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 10], 10, -30611744);
    c = ii(c, d, a, b, x[i + 1], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 8], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 15], 6, -145523070);
    d = ii(d, a, b, c, x[i + 6], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 13], 15, 718787259);
    b = ii(b, c, d, a, x[i + 4], 21, -343485551);
    a = (a + olda) >>> 0;
    b = (b + oldb) >>> 0;
    c = (c + oldc) >>> 0;
    d = (d + oldd) >>> 0;
  }
  return [a, b, c, d].map((v) => (v >>> 0).toString(16).padStart(8, "0")).join("");
}
