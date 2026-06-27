import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useRef } from "react";

interface Props {
    playbackId: string;
    thumbnail?: string;
    className?: string;
    fillMode?: "auto" | "cover";
}

type PlayerEl = HTMLElement & {
    play(): Promise<void>;
    pause(): void;
};

export function MuxAutoPlayer({
    playbackId,
    thumbnail,
    className = "",
    fillMode = "auto",
}: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = wrapperRef.current;
        if (!root) return;

        let observer: IntersectionObserver | null = null;
        let observed: PlayerEl | null = null;

        const attach = () => {
            const player = root.querySelector("mux-player") as PlayerEl | null;
            if (!player) return false;
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const el = entry.target as PlayerEl;
                        if (entry.isIntersecting) {
                            el.play().catch(() => {});
                        } else {
                            el.pause();
                        }
                    });
                },
                { threshold: 0.5 },
            );
            observer.observe(player);
            observed = player;
            return true;
        };

        if (!attach()) {
            const id = setTimeout(attach, 100);
            return () => {
                clearTimeout(id);
                if (observed && observer) observer.unobserve(observed);
                observer?.disconnect();
            };
        }

        return () => {
            if (observed && observer) observer.unobserve(observed);
            observer?.disconnect();
        };
    }, [playbackId]);

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
                maxResolution="2160p"
                minResolution="1080p"
                playsInline
                preload="auto"
            />
            <div className="absolute inset-0 z-10" />
        </div>
    );
}
