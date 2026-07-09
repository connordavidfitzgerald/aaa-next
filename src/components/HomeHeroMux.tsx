import MuxPlayer from "@mux/mux-player-react";
import { useVideoQuality } from "@/lib/useVideoQuality";

export function HomeHeroMux() {
  const quality = useVideoQuality();
  return (
    <MuxPlayer
      playbackId="PSOFY00GHCtgIt3glmKPtT5rV0200Zbz2j5Tko0202Q2G4TU"
      autoPlay="muted"
      muted
      maxResolution={quality.maxResolution}
      minResolution={quality.minResolution}
      loop
      playsInline
      className="object-cover w-full md:h-auto h-auto md:aspect-[935/332] aspect-4/3 flex "
      style={{
        width: "100%",
        // Fill (and crop) the reserved box rather than letterboxing — so mobile
        // fills the 4/3 container and desktop fills its native-ratio box.
        "--media-object-fit": "cover",
      }}
    />
  );
}
