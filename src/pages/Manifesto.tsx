import { useEffect, useRef } from "react";
import { MuxAutoPlayer } from "@/components/MuxAutoPlayer";

// The manifesto, one entry per line. Empty strings are stanza breaks (rendered
// as a blank line). Each line reveals on scroll: a green rectangle wipes across
// it left→right, leaving black text on a green highlight fitted to the text.
const LINES = [
  "There is work you take because it pays.",
  "There is work you take because it interests you.",
  "And then there is the other kind.",
  "The kind that keeps you up.",
  "",
  "That work deserves more.",
  "",
  "Some work is bigger than any one pair of hands.",
  "So independent practices came together,",
  "each with its own craft,",
  "drawn by the work and by each other,",
  "until it could finally be carried",
  "the way it deserved.",
  "",
  "It became a cooperative.",
  "One member, one vote.",
  "Every voice weighs the same.",
  "The work flows to whoever can carry it best.",
  "And the credit stays with the work,",
  "because how it is built",
  "is part of what it stands for.",
  "",
  "The work is carried long after the launch,",
  "when the applause has faded",
  "and the making goes on.",
  "",
  "Devotion outlasts attention.",
  "",
  "If what you are building matters",
  "to the people you serve,",
  "there is a place for it here,",
  "people who carry it with you and stay.",
  "",
  "",
  "",
  "",
  "",
  "",
  "Approach",
  "",
  "",
  "",
  "",
  "",
  "",
  "Welcome.",
  "Open the door to every voice, every story.",
  "Honour every heritage, every face.",
  "",
  "Cultivate.",
  "Act with conviction and ethics,",
  "to elevate projects and their missions.",
  "",
  "Illuminate.",
  "Open conversations guided by real needs.",
  "",
  "Craft.",
  "Fashion living archives,",
  "equal to the desires of the age.",
  "",
  "Amplify.",
  "Translate singular dreams",
  "and the utopias at the margins.",
  "Weave bonds between progress and humanity.",
];

// clip-path states: hidden collapses the line to its left edge; shown reveals
// the whole line. Animating between them wipes the green+text in left→right.
const HIDDEN = "inset(-1% 100% -1% 0%)";
const SHOWN = "inset(-1% 0% -1% 0%)";

export function ManifestoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", root);

      // Reduced motion: show everything, no scroll-driven wipe.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        lines.forEach((el) => gsap.set(el, { clipPath: SHOWN }));
        return;
      }

      lines.forEach((el) => {
        const tween = gsap.fromTo(
          el,
          { clipPath: HIDDEN },
          {
            clipPath: SHOWN,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              // Wipe in as the line travels from near the bottom of the
              // viewport up past the middle — tied directly to scroll.
              start: "top 90%",
              end: "top 80%",
              scrub: true,
            },
          },
        );
        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      });

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <main className="relative w-full text-xs">
      {/* Full-viewport video background. Sticky (not fixed) so it stays behind
          the manifesto while it scrolls, then rises away with the content
          before the footer is revealed below. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <MuxAutoPlayer
          playbackId="y78a00Av1dLxN4u201SYutcUghoFm9up8JppX8CkbIahY"
          fillMode="cover"
        />
      </div>
      {/* Text scrolls up over the video. Pulled up one viewport so the first
          screen shows only the video, then the lines rise into view. */}
      <div
        ref={containerRef}
        className="relative z-10 -mt-[100vh] flex flex-col items-center gap-2 pb-[100vh]"
      >
        <div className="h-screen" aria-hidden></div>
        <div className=" text-center text-lg uppercase font-bold tracking-[-0.022em] leading-[80%]">
          {LINES.map((line, i) =>
            line === "" ? (
              <div key={i} aria-hidden className="h-[1.1em]" />
            ) : (
              <div key={i}>
                <span
                  data-line
                  className="inline-block bg-green px-0.5 pt-1 text-black"
                  style={{ clipPath: HIDDEN }}
                >
                  {line}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </main>
  );
}
