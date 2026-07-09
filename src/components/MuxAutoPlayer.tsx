import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useRef, useState } from "react";
import { useVideoQuality } from "@/lib/useVideoQuality";

interface Props {
    playbackId: string;
    thumbnail?: string;
    className?: string;
    fillMode?: "auto" | "cover";
}

export function MuxAutoPlayer({
    playbackId,
    thumbnail,
    className = "",
    fillMode = "auto",
}: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const quality = useVideoQuality();

    // Only mount the <mux-player> while the cell is near the viewport. On a long
    // homepage this keeps the number of live media elements small, which sidesteps
    // mobile Safari's concurrent-decode ceiling (beyond a handful of playing
    // videos it silently refuses to start more) and avoids every player fetching
    // segments at once. The poster <img> below always renders, so off-screen
    // cells still show a still frame. `rootMargin` pre-warms just before entry so
    // playback is already running by the time the cell scrolls into view.
    const [near, setNear] = useState(false);

    useEffect(() => {
        const root = wrapperRef.current;
        if (!root) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) setNear(entry.isIntersecting);
            },
            { rootMargin: "300px 0px", threshold: 0 },
        );
        observer.observe(root);
        return () => observer.disconnect();
    }, []);

    // Mux serves a resized thumbnail when given a width, so we don't pull the
    // full-resolution still just for the poster behind the video.
    const thumbSrc =
        thumbnail ?? `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1200`;

    return (
        <div ref={wrapperRef} className={`relative w-full h-full ${className}`}>
            <img
                src={thumbSrc}
                alt=""
                loading="lazy"
                decoding="async"
                className={
                    fillMode === "cover"
                        ? "w-full h-full object-cover block"
                        : "w-full h-auto block"
                }
            />
            {near && (
                <MuxPlayer
                    playbackId={playbackId}
                    className="absolute inset-0 w-full h-full"
                    style={{
                        "--media-background-color": "white",
                        ...(fillMode === "cover"
                            ? { "--media-object-fit": "cover" }
                            : {}),
                    }}
                    loop
                    muted
                    // Mounted only when near the viewport, so autoPlay starts it
                    // immediately without every cell competing on first paint.
                    autoPlay="muted"
                    maxResolution={quality.maxResolution}
                    minResolution={quality.minResolution}
                    playsInline
                    preload="auto"
                />
            )}
            <div className="absolute inset-0 z-10" />
        </div>
    );
}
