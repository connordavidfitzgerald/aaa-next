import MuxPlayer from "@mux/mux-player-react";

export function HomeHeroMux() {
  return (
    <MuxPlayer
      playbackId="PSOFY00GHCtgIt3glmKPtT5rV0200Zbz2j5Tko0202Q2G4TU"
      autoPlay="muted"
      muted
      minResolution="1080p"
      loop
      playsInline
      className="md:aspect-1870/664 aspect-9/16 object-cover md:w-auto md:h-auto w-full h-full block md:flex"
      style={{
        width: "100%",
        paddingTop: "var(--nav-height)",
      }}
    />
  );
}
