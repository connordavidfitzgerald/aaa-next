import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useRef, useState } from "react";
import { useVideoQuality } from "@/lib/useVideoQuality";

// Minimal slice of the mux-player element API we drive.
type PlayerEl = HTMLElement & {
  play(): Promise<void>;
  pause(): void;
  muted: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  requestFullscreen?: () => Promise<void>;
};

const fmt = (s: number): string => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

// A Mux video with custom, site-styled controls (play/pause, mute, scrub,
// time, fullscreen) — native UI is hidden. Used for the optional team-member
// video. Text controls invert against the frame via mix-blend-difference so
// they stay legible on any footage; the scrubber uses the brand green.
export function TeamVideoPlayer({
  playbackId,
  aspectRatio,
  className = "",
}: {
  playbackId: string;
  /** CSS aspect-ratio (e.g. "4 / 3"). Reserves the box so the player doesn't
   *  reflow once metadata loads. Falls back to 16/9 when unknown. */
  aspectRatio?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerEl | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);
  const quality = useVideoQuality();

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // Mirror the player's state into React on every relevant event.
  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;
    const sync = () => {
      setPlaying(!el.paused);
      setMuted(el.muted);
      setCurrent(el.currentTime || 0);
      setDuration(el.duration || 0);
    };
    const events = [
      "play",
      "pause",
      "timeupdate",
      "loadedmetadata",
      "durationchange",
      "volumechange",
    ];
    events.forEach((e) => el.addEventListener(e, sync));
    sync();
    return () => events.forEach((e) => el.removeEventListener(e, sync));
  }, [playbackId]);

  // Autoplay only while on-screen: start when the frame scrolls into view, pause
  // when it leaves. This replaces the always-on `autoPlay` so the video isn't
  // decoding off-screen, and mirrors the grid previews' viewport-gated playback.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const el = playerRef.current;
        if (!el) return;
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [playbackId]);

  const pct =
    duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;

  const togglePlay = () => {
    const el = playerRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  const toggleMute = () => {
    const el = playerRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const toggleFullscreen = () => {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => {});
  };

  const seekFromX = (clientX: number) => {
    const el = playerRef.current;
    const tl = timelineRef.current;
    if (!el || !tl || !el.duration) return;
    const rect = tl.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    el.currentTime = p * el.duration;
    setCurrent(el.currentTime);
  };

  const ctl = "mix-blend-difference text-white cursor-pointer hover:opacity-70";

  return (
    <div
      ref={containerRef}
      className={`group relative w-full ${className}`}
      style={{ aspectRatio: aspectRatio ?? "16 / 9" }}
    >
      <MuxPlayer
        ref={(el) => {
          playerRef.current = el as unknown as PlayerEl | null;
        }}
        playbackId={playbackId}
        className="absolute inset-0 w-full h-full block"
        style={{
          "--controls": "none",
          "--media-background-color": "white",
          "--media-object-fit": "contain",
        }}
        playsInline
        muted
        loop
        maxResolution={quality.maxResolution}
        minResolution={quality.minResolution}
        preload="metadata"
      />

      {/* Click anywhere on the frame to play/pause (sits below the controls). */}
      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={togglePlay}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Controls. The bar is click-through; only the controls themselves take
          pointer events, so empty space still toggles play via the layer above.
          Hidden until hover/focus while playing; always shown when paused. */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 px-2 py-1.5 text-xs uppercase tracking-[-0.01em] select-none transition-opacity duration-200 ${
          playing
            ? "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
            : "opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={togglePlay}
          className={`pointer-events-auto ${ctl}`}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className={`pointer-events-auto ${ctl}`}
        >
          {muted ? "Unmute" : "Mute"}
        </button>

        <div
          ref={timelineRef}
          onPointerDown={(e) => {
            scrubbing.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            seekFromX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (scrubbing.current) seekFromX(e.clientX);
          }}
          onPointerUp={() => {
            scrubbing.current = false;
          }}
          onPointerCancel={() => {
            scrubbing.current = false;
          }}
          className="pointer-events-auto relative flex-1 h-3 cursor-pointer touch-none"
        >
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white mix-blend-difference" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-green"
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-green"
            style={{ left: `${pct}%` }}
          />
        </div>

        <span className="mix-blend-difference text-white tabular-nums inline-flex gap-1">
          <span>{fmt(current)}</span>
          <span>/</span>
          <span>{fmt(duration)}</span>
        </span>
        <button
          type="button"
          onClick={toggleFullscreen}
          className={`pointer-events-auto hidden md:inline ${ctl}`}
        >
          Fullscreen
        </button>
      </div>
    </div>
  );
}
