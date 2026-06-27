import type { MediaItem as Item } from "@/lib/projects";
import { MuxAutoPlayer } from "./MuxAutoPlayer";
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
    return (
        <div className="relative w-full">
            <MuxAutoPlayer
                playbackId={item.muxPlaybackId}
                thumbnail={item.thumbnail}
            />
        </div>
    );
}
