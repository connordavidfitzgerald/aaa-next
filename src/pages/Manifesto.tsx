import { Fragment, useEffect, useRef, type ReactNode } from "react";
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

// Reference panel content. Kept as data so the structured layout below stays
// declarative and the copy is easy to edit in one place.

// Approach: [term, description] pairs.
const APPROACH: [string, string][] = [
  [
    "Welcome",
    "Open the door to every voice, every story. Honour every heritage, every face.",
  ],
  [
    "Cultivate",
    "Act with conviction and ethics, to elevate projects and their missions.",
  ],
  ["Illuminate", "Open conversations guided by real needs."],
  ["Craft", "Fashion living archives, equal to the desires of the age."],
  [
    "Amplify",
    "Translate singular dreams and the utopias at the margins. Weave bonds between progress and humanity.",
  ],
];

// Manifesto: stanzas, each an array of lines joined by soft breaks.
const MANIFESTO: string[][] = [
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
    "One member, one vote. Every voice weighs the same.",
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

// Capabilities: category title + the services under it.
const CAPABILITIES: { title: string; items: ReactNode[] }[] = [
  {
    title: "Branding",
    items: [
      "Creative and art direction",
      "Visual identity",
      "Messaging and voice development",
      "Strategy and positioning",
      "Content strategy",
    ],
  },
  {
    title: "Web",
    items: [
      "UI/UX design",
      "Frontend development",
      "E-commerce",
      "Maintenance and support",
    ],
  },
  {
    title: "Visual",
    items: [
      "Editorial & publication design",
      "Campaign",
      "Illustration",
      "Motion design",
      "Photography",
      "Video production",
    ],
  },
  {
    title: "Amplification",
    items: [
      "Social media",
      "SEO",
      "Content management",
      <>
        Grant writing via{" "}
        <a href="/initiatives" className="underline underline-offset-2">
          Gia
        </a>
      </>,
    ],
  },
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
        className="relative z-10 -mt-[100vh] flex flex-col items-center gap-2 "
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
        <div className="h-[50vh]"></div>

        {/* Structured reference panel. The poetic scroll above resolves into a
            plain editorial index of the three pillars, laid out on the site's
            18-column grid: Approach (4) · Manifesto (6) · Capabilities (8).
            Section labels follow the site convention (muted + bottom rule);
            terms/categories sit at full strength with their copy muted. */}
        <section
          id="capabilities"
          className="w-full min-h-screen bg-green px-2 pt-2 -mt-[calc(var(--nav-height)*0.825)] pb-24"
        >
          <div className="grid grid-cols-18 gap-2 gap-y-6 text-xs leading-[1.2] tracking-[-0.01em]">
            {/* Approach */}
            <div className="col-span-18 md:col-span-4 flex flex-col gap-2">
              <p className="pb-1  border-b border-black/20">Approach</p>
              <div className="flex flex-col gap-2">
                {APPROACH.map(([term, desc]) => (
                  <div key={term} className="flex flex-col">
                    <p>{term}</p>
                    <p className="opacity-70">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manifesto */}
            <div className="col-span-18 md:col-span-4 flex flex-col gap-2">
              <p className="pb-0.5 md:pb-1 border-b border-black/20">Stance</p>
              <div className="flex flex-col gap-[1.2em]">
                {MANIFESTO.map((stanza, i) => (
                  <p key={i}>
                    {stanza.map((l, j) => (
                      <Fragment key={j}>
                        {l}
                        {j < stanza.length - 1 && <br />}
                      </Fragment>
                    ))}
                  </p>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="col-span-18 md:col-span-10 flex flex-col gap-2">
              <p className="pb-0.5 md:pb-1 border-b border-black/20">
                Capabilities
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
                {CAPABILITIES.map(({ title, items }) => (
                  <div key={title} className="flex flex-col ">
                    <p>{title}</p>
                    <ul className="flex flex-col opacity-70">
                      {items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
