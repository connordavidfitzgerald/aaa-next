import { useEffect } from "react";

// The manifesto, one array per paragraph and one string per visible line. Each
// line renders as its own block so it can be individually blacked-out and
// revealed on scroll.
const paragraphs: string[][] = [
  [
    "There is work you take because it pays.",
    "There is work you take because it interests you.",
    "And then there is the other kind.",
    "The kind that keeps you up.",
  ],
  ["That work deserves more."],
  [
    "Some work is bigger than any one pair of hands.",
    "So independent practices came together,",
    "each with its own craft,",
    "drawn by the work and by each other,",
    "until it could finally be carried the way it deserved.",
  ],
  [
    "It became a cooperative.",
    "One member, one vote.",
    "Every voice weighs the same.",
    "The work flows to whoever can carry it best.",
    "And the credit stays with the work,",
    "because how it is built is part of what it stands for.",
  ],
  [
    "The work is carried long after the launch,",
    "when the applause has faded and the making goes on.",
    "Devotion outlasts attention.",
  ],
  [
    "If what you are building matters to the people you serve,",
    "there is a place for it here,",
    "people who carry it with you and stay.",
  ],
];

// --- scroll-behaviour tunables ---------------------------------------------
// Opacity by line distance from the centred line: centre 100%, ±1 20%, ±2 10%,
// ±3+ hidden. Interpolated so it stays smooth between snaps.
const OPACITY_STOPS = [1, 0.2, 0.1, 0];
// Fraction of a line you must scroll past before it advances to the next line.
// Higher = more effort to move on; 0.5 ≈ plain snap-to-nearest.
const SNAP_THRESHOLD = 0.9;
const SETTLE_MS = 5; // idle time after scrolling before the snap fires
const SNAP_DURATION = 1; // seconds for the eased snap glide

function opacityAt(dist: number): number {
  const last = OPACITY_STOPS.length - 1;
  const i = Math.floor(dist);
  if (i >= last) return OPACITY_STOPS[last];
  return (
    OPACITY_STOPS[i] + (OPACITY_STOPS[i + 1] - OPACITY_STOPS[i]) * (dist - i)
  );
}

// Fractional index of the line sitting at `center` (a viewport-relative y), so
// distance can be counted in whole lines regardless of paragraph spacing.
function fractionalCenterIndex(mids: number[], center: number): number {
  const n = mids.length;
  if (n <= 1) return 0;
  if (center <= mids[0]) {
    const gap = mids[1] - mids[0];
    return gap > 0 ? (center - mids[0]) / gap : 0;
  }
  if (center >= mids[n - 1]) {
    const gap = mids[n - 1] - mids[n - 2];
    return gap > 0 ? n - 1 + (center - mids[n - 1]) / gap : n - 1;
  }
  for (let i = 0; i < n - 1; i++) {
    if (center >= mids[i] && center <= mids[i + 1]) {
      const gap = mids[i + 1] - mids[i];
      return gap > 0 ? i + (center - mids[i]) / gap : i;
    }
  }
  return 0;
}

const lineMidpoints = (lines: HTMLElement[]) =>
  lines.map((l) => {
    const r = l.getBoundingClientRect();
    return r.top + r.height / 2;
  });

export function ManifestoPage() {
  useEffect(() => {
    document.title = "Applied Archive Atelier — Manifesto";
    const html = document.documentElement;
    const prevNavBg = html.style.getPropertyValue("--nav-bg");
    const prevPageBg = html.style.getPropertyValue("--page-bg");
    html.style.setProperty("--nav-bg", "var(--color-green)");
    html.style.setProperty("--page-bg", "var(--color-green)");
    // Flag the page so the navbar's hover effect can invert (black bar, green
    // text) against the green background — see index.css.
    html.dataset.manifesto = "true";

    return () => {
      html.style.setProperty("--nav-bg", prevNavBg || "white");
      html.style.setProperty("--page-bg", prevPageBg || "white");
      delete html.dataset.manifesto;
    };
  }, []);

  // Each line's opacity is set by how many lines away it is from the line
  // currently centred in the viewport (counted by index, so paragraph gaps
  // don't distort it): centre 100%, ±1 20%, ±2 10%, ±3+ hidden.
  useEffect(() => {
    const lines = Array.from(
      document.querySelectorAll<HTMLElement>("[data-manifesto-line]"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lines.forEach((line) => (line.style.opacity = "1"));
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const fc = fractionalCenterIndex(
        lineMidpoints(lines),
        window.innerHeight / 2,
      );
      lines.forEach((line, j) => {
        line.style.opacity = `${opacityAt(Math.abs(j - fc))}`;
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // "Sticky" snapping, like Apple's wheel pickers: once scrolling settles, glide
  // the centred line to the middle. It only advances to a new line once the
  // scroll passes SNAP_THRESHOLD of a line — otherwise it springs back to the
  // current one, so it takes a bit of effort to move on. Routed through the
  // shared Lenis instance for a smooth, eased snap.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type LenisLike = {
      scrollTo: (
        target: number,
        opts?: { duration?: number; onComplete?: () => void },
      ) => void;
    };

    const lines = Array.from(
      document.querySelectorAll<HTMLElement>("[data-manifesto-line]"),
    );
    if (lines.length === 0) return;

    let settleTimer: ReturnType<typeof setTimeout>;
    let snapping = false;
    let currentIndex = 0;

    const lockNearest = () => {
      currentIndex = Math.round(
        fractionalCenterIndex(lineMidpoints(lines), window.innerHeight / 2),
      );
    };
    lockNearest(); // start locked to whatever is centred on load

    const snap = () => {
      const mids = lineMidpoints(lines);
      const center = window.innerHeight / 2;
      const fc = fractionalCenterIndex(mids, center);

      // Advance only once we've crossed the threshold; otherwise hold.
      let target =
        Math.abs(fc - currentIndex) >= SNAP_THRESHOLD
          ? Math.round(fc)
          : currentIndex;
      target = Math.max(0, Math.min(lines.length - 1, target));
      currentIndex = target;

      const destination = window.scrollY + (mids[target] - center);
      if (Math.abs(destination - window.scrollY) < 1) return;

      snapping = true;
      const release = () => {
        snapping = false;
      };
      const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
      if (lenis) {
        lenis.scrollTo(destination, {
          duration: SNAP_DURATION,
          onComplete: release,
        });
        setTimeout(release, SNAP_DURATION * 1000 + 300); // safety
      } else {
        window.scrollTo({ top: destination, behavior: "smooth" });
        setTimeout(release, 600);
      }
    };

    const onScroll = () => {
      if (snapping) return; // ignore the scroll events our own snap emits
      clearTimeout(settleTimer);
      settleTimer = setTimeout(snap, SETTLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", lockNearest, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", lockNearest);
      clearTimeout(settleTimer);
    };
  }, []);

  return (
    <main className="flex flex-col justify-start px-2 w-full text-xs h-fit">
      <div className="grid grid-cols-9 gap-2">
        <div className="flex flex-col col-span-9 h-fit w-full text-[50px] font-bold uppercase leading-[100%] text-center tracking-[-0.03em] mt-[calc(50vh-0.5em)]">
          {paragraphs.map((lines, pi) => (
            <p key={pi} className="mb-[1em] last:mb-0">
              {lines.map((line, li) => (
                <span key={li} className="block">
                  <span
                    data-manifesto-line
                    className="inline-block opacity-20 will-change-[opacity]"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
      <div className="h-[calc(50vh-0.5em)]"></div>
    </main>
  );
}
