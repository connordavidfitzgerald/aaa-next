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
      className="object-cover md:w-auto md:h-auto w-auto  h-auto  flex md:pt-0  pt-[calc(var(--nav-height))]"
      style={{
        width: "100%",
      }}
    />
  );
}
