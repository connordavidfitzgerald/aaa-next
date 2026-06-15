import Image from "next/image";

import type { MediaItem as Item } from "@/lib/projects";
import { MuxAutoPlayer } from "./MuxAutoPlayer";

export function MediaItem({ item }: { item: Item }) {
    if (item.kind === "image") {
        return (
            <Image
                src={item.src}
                alt={item.alt ?? ""}
                className="w-full h-auto"
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
