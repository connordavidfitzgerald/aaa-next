"use client";

import MuxPlayer from "@mux/mux-player-react";

export function HomeHeroMux() {
    return (
        <MuxPlayer
            playbackId="iU8heoPsVZrdSsS9D006daozDYoI01D7pHFNoSSSuDkuc"
            autoPlay="muted"
            muted
            minResolution="1080p"
            loop
            playsInline
            style={{ aspectRatio: "2.39/1" }}
        />
    );
}
