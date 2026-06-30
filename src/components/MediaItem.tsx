import type { MediaItem as Item } from "@/lib/projects";
import { MuxAutoPlayer } from "./MuxAutoPlayer";
import { TeamVideoPlayer } from "@/components/TeamVideoPlayer";
import { SanityImage } from "@/components/SanityImage";

export function MediaItem({ item }: { item: Item }) {
    if (item.kind === "image") {
        return (
            <SanityImage
                src={item.src}
                alt={item.alt ?? ""}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 66vw"
            />
        );
    }
    // Videos flagged "Show controls" in the CMS get the custom-controls player
    // (shared with team videos); everything else stays a silent autoplay loop.
    if (item.controls) {
        return (
            <TeamVideoPlayer
                playbackId={item.muxPlaybackId}
                aspectRatio={item.aspect}
            />
        );
    }
    return (
        <div className="relative w-full">
            <MuxAutoPlayer
                playbackId={item.muxPlaybackId}
                thumbnail={item.thumbnail}
            />
        </div>
    );
}
