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

export function ManifestoPage() {
  useEffect(() => {
    document.title = "Applied Archive Atelier — Manifesto";
    const html = document.documentElement;
    const prevNavBg = html.style.getPropertyValue("--nav-bg");
    const prevPageBg = html.style.getPropertyValue("--page-bg");
    html.style.setProperty("--nav-bg", "var(--color-green)");
    html.style.setProperty("--page-bg", "var(--color-green)");

    return () => {
      html.style.setProperty("--nav-bg", prevNavBg || "white");
      html.style.setProperty("--page-bg", prevPageBg || "white");
    };
  }, []);

  // Each line's opacity scrubs with its distance from the vertical centre of the
  // viewport: fully opaque when its midpoint sits at the centre, fading back to
  // BASE_OPACITY once it's a band away (above or below). Driven by scroll
  // position, so it tracks both directions.
  useEffect(() => {
    const lines = Array.from(
      document.querySelectorAll<HTMLElement>("[data-manifesto-line]"),
    );

    const BASE_OPACITY = 0.1;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lines.forEach((line) => (line.style.opacity = "1"));
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const center = window.innerHeight / 2;
      lines.forEach((line) => {
        const r = line.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        // The band is one line tall: fully opaque at the centre, back to base
        // by the time the line is a full line-height away.
        const proximity = Math.min(
          1,
          Math.max(0, 1 - Math.abs(mid - center) / r.height),
        );
        line.style.opacity = `${BASE_OPACITY + (1 - BASE_OPACITY) * proximity}`;
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

  return (
    <main className="flex flex-col justify-start px-2 w-full text-xs h-fit">
      <div className="grid grid-cols-9 gap-2">
        <div className="flex flex-col col-span-9 h-fit w-full text-[30px] font-bold uppercase leading-[100%] text-center tracking-[-0.03em] mt-[calc(50vh-0.5em)]">
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
