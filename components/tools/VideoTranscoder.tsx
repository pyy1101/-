"use client";

import { useState, useRef, useCallback } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

type Quality = { label: string; bitrate: number };
type FormatOption = { mime: string; ext: string; label: string; qualities: Quality[] };

const FORMATS: FormatOption[] = [
  {
    mime: "video/webm; codecs=vp8", ext: "webm", label: "WebM (VP8)",
    qualities: [
      { label: "低", bitrate: 1_000_000 },
      { label: "中", bitrate: 2_500_000 },
      { label: "高", bitrate: 5_000_000 },
    ],
  },
  {
    mime: "video/webm; codecs=vp9", ext: "webm", label: "WebM (VP9)",
    qualities: [
      { label: "低", bitrate: 800_000 },
      { label: "中", bitrate: 2_000_000 },
      { label: "高", bitrate: 4_000_000 },
    ],
  },
  {
    mime: "video/mp4", ext: "mp4", label: "MP4 (H.264)",
    qualities: [
      { label: "低", bitrate: 1_000_000 },
      { label: "中", bitrate: 2_500_000 },
      { label: "高", bitrate: 5_000_000 },
    ],
  },
];

export default function VideoTranscoder() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputName, setInputName] = useState("");
  const [inputSize, setInputSize] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fmtIdx, setFmtIdx] = useLocalStorage("tool-video-fmt", 0);
  const [qualIdx, setQualIdx] = useLocalStorage("tool-video-qual", 1);
  const [status, setStatus] = useState<"idle" | "ready" | "transcoding" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleFile = useCallback((file: File) => {
    const size = file.size > 1024 * 1024 * 1024 ? `${(file.size / 1024 / 1024 / 1024).toFixed(1)} GB` : file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`;
    setInputFile(file);
    setInputName(file.name);
    setInputSize(size);
    setStatus("ready");
    setOutputUrl(null);
    setMessage("");
  }, []);

  const transcode = useCallback(async () => {
    if (!inputFile) return;
    const fmt = FORMATS[fmtIdx];
    const qual = fmt.qualities[qualIdx];

    setStatus("transcoding");
    setProgress(0);
    setMessage("准备转码...");
    chunksRef.current = [];

    try {
      if (!MediaRecorder.isTypeSupported(fmt.mime)) {
        throw new Error(`浏览器不支持 ${fmt.label} 编码，请尝试其他格式`);
      }

      const video = document.createElement("video");
      video.src = URL.createObjectURL(inputFile);
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("视频无法解码，文件格式不受支持"));
        video.load();
      });

      const duration = video.duration;
      if (!isFinite(duration) || duration <= 0) {
        throw new Error("无法读取视频时长");
      }

      setMessage(`视频时长 ${Math.floor(duration)} 秒，开始转码...`);

      const stream = (video as any).captureStream?.() || (video as any).mozCaptureStream?.();
      if (!stream) {
        throw new Error("浏览器不支持视频流捕获");
      }

      try {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        source.connect(audioCtx.destination);
        const audioTracks = dest.stream.getAudioTracks();
        audioTracks.forEach(t => stream.addTrack(t));
      } catch {
        // Audio capture may fail, continue with video only
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: fmt.mime,
        videoBitsPerSecond: qual.bitrate,
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      await new Promise<void>((resolve, reject) => {
        recorder.onstop = () => resolve();
        recorder.onerror = () => reject(new Error("录制过程出错"));

        recorder.start(500);

        video.currentTime = 0;
        video.play().catch(() => {});

        const tick = () => {
          if (video.ended || video.currentTime >= duration) {
            recorder.stop();
            video.pause();
            return;
          }
          const pct = Math.round((video.currentTime / duration) * 100);
          setProgress(pct);
          setMessage(`转码中... ${pct}%`);
        };

        const interval = setInterval(() => {
          tick();
          if (video.ended || video.currentTime >= duration) {
            clearInterval(interval);
          }
        }, 500);

        video.onended = () => {
          clearInterval(interval);
          recorder.stop();
        };

        setTimeout(() => {
          clearInterval(interval);
          if (recorder.state === "recording") recorder.stop();
        }, (duration + 10) * 1000);
      });

      const blob = new Blob(chunksRef.current, { type: FORMATS[fmtIdx].ext === "mp4" ? "video/mp4" : "video/webm" });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setProgress(100);
      setMessage(`转码完成！输出大小 ${(blob.size / 1024 / 1024).toFixed(1)} MB`);
      setStatus("done");

      URL.revokeObjectURL(video.src);
      for (const t of stream.getTracks()) t.stop();
    } catch (err: any) {
      setMessage(err?.message || "转码失败");
      setStatus("error");
    }
  }, [inputFile, fmtIdx, qualIdx]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("video/") || f?.name.match(/\.(mp4|webm|mkv|mov|avi|flv|wmv|ts|m4v)$/i)) handleFile(f);
  };

  const fmt = FORMATS[fmtIdx];

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragging ? "border-[var(--color-accent)] bg-[var(--color-accent-light)]" : inputFile ? "border-[var(--color-success-border)] bg-[var(--color-success)]" : "border-[var(--color-border)] bg-[var(--color-muted)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)]"}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <p className="text-4xl mb-2">🎬</p>
        <p className="text-[var(--color-text-dim)] text-sm">点击或拖拽视频文件到这里</p>
        <p className="text-[var(--color-text-faint)] text-xs mt-1">浏览器内置引擎转码，无需等待加载，秒开即用</p>
      </div>

      {inputFile && (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-[var(--color-text)] font-medium truncate max-w-[200px]">{inputName}</span>
          <span className="text-xs text-[var(--color-text-faint)]">{inputSize}</span>
          <button onClick={() => { setInputFile(null); setInputName(""); setInputSize(""); setStatus("idle"); setOutputUrl(null); }} className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-error-text)] ml-auto">清除</button>
        </div>
      )}

      {inputFile && status !== "transcoding" && (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-xs text-[var(--color-text-dim)] mb-1">输出格式</label>
              <div className="flex gap-1">
                {FORMATS.map((f, i) => (
                  <button key={f.mime} onClick={() => { setFmtIdx(i); setQualIdx(1); }} className={`px-3 py-2 rounded-lg text-sm transition-colors ${fmtIdx === i ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-[var(--color-text-dim)] mb-1">画质</label>
              <div className="flex gap-1">
                {fmt.qualities.map((q, i) => (
                  <button key={i} onClick={() => setQualIdx(i)} className={`px-3 py-2 rounded-lg text-sm transition-colors ${qualIdx === i ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text)] hover:brightness-95"}`}>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <button onClick={transcode} className="px-5 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">开始转码</button>
            </div>
          </div>
          <p className="text-[11px] text-[var(--color-text-faint)]">提示：MediaRecorder 转码速度 = 视频时长（实时播放），不支持倍速；MP4 仅 Safari 支持</p>
        </div>
      )}

      {status === "transcoding" && (
        <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--color-accent)]">{message}</span>
            <span className="text-xs text-[var(--color-accent)]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[var(--color-muted)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-[var(--color-text-faint)] mt-2">转码速度为实时播放速度，大视频请耐心等待</p>
        </div>
      )}

      {status === "done" && outputUrl && (
        <div className="bg-[var(--color-success)] border border-[var(--color-success-border)] rounded-lg p-4 flex items-center gap-3 flex-wrap">
          <span className="text-[var(--color-success-text)] text-sm font-medium">{message}</span>
          <a href={outputUrl} download={`output.${fmt.ext}`} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors">
            下载视频
          </a>
          <button onClick={() => { if (outputUrl) URL.revokeObjectURL(outputUrl); setStatus("ready"); setOutputUrl(null); }} className="text-xs text-[var(--color-text-faint)] hover:text-[var(--color-text-dim)]">返回</button>
        </div>
      )}

      {status === "error" && (
        <div className="bg-[var(--color-error)] border border-[var(--color-error-border)] rounded-lg px-4 py-3">
          <p className="text-sm text-[var(--color-error-text)]">{message}</p>
          <p className="text-xs text-[var(--color-error-text)] mt-1">尝试更换输出格式后重试</p>
        </div>
      )}
    </div>
  );
}
