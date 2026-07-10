import MuxPlayer from "@mux/mux-player-react";
import { useVideoQuality } from "@/lib/useVideoQuality";

export function HomeHeroMux() {
  const quality = useVideoQuality();
  return (
    <MuxPlayer
      playbackId={
        quality.isMobile
          ? "pTCeAfCZnyQkQCn700cosk02v2R42w4ibSAyPNWZ8JVxQ"
          : "DvqTExvLnOyguwQ94gecuWx02Qocm00tP02hQFUFWkw5yk"
      }
      autoPlay="muted"
      muted
      maxResolution={quality.maxResolution}
      minResolution={quality.minResolution}
      loop
      playsInline
      className="object-cover w-full md:h-auto h-auto md:aspect-[935/332] aspect-square flex "
      style={{
        width: "100%",
        // Fill (and crop) the reserved box rather than letterboxing — so mobile
        // fills the 4/3 container and desktop fills its native-ratio box.
        "--media-object-fit": "cover",
      }}
    />
  );
}
