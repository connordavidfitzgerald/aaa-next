import { useEffect, useState } from "react";

// Resolution profile for Mux players, tuned per device.
//
// Desktop keeps the full-quality profile (up to 4K, never below 1080p).
//
// Mobile drops the `minResolution` floor entirely: with no floor, Mux's
// adaptive bitrate serves a rendition sized to the *actual* rendered cell —
// which on a phone is small — so the first frame arrives fast and autoplay
// fires reliably instead of stalling while a forced 1080p+ segment buffers.
// The `maxResolution` cap of 1080p just stops phones from ever pulling a 4K
// rendition they can't display; ABR still picks lower when the cell is small,
// so perceived quality is unchanged.
export type VideoQuality = {
  maxResolution: "1080p" | "2160p";
  minResolution?: "1080p";
};

const MOBILE_QUERY = "(max-width: 768px)";

export function useVideoQuality(): VideoQuality {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile
    ? { maxResolution: "1080p" }
    : { maxResolution: "2160p", minResolution: "1080p" };
}
