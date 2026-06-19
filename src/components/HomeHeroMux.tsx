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
      style={{
        aspectRatio: "1870/664",
        width: "100%",
        paddingTop: "var(--nav-height)+(var",
      }}
    />
  );
}
