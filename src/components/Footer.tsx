import { useEffect, useRef } from "react";

import { NavMenu } from "@/components/NavMenu";
import aSvg from "@/assets/svgs/A.svg";
import periodSvg from "@/assets/svgs/period.svg";

// The wordmark, one glyph <img> per character. justify-between spreads them
// while small and pins the outer A's to the footer edges; the middle A stays
// centred and the dots ride the gaps between the A's. Widths/heights are set in
// `em` from each SVG's intrinsic size (A 499×496, period 103×103) using the A's
// height as the unit, so a single font-size scales the whole row and items-end
// keeps every glyph sitting on the shared baseline.
const A_UNIT = 496;
const GLYPHS = [
  { src: aSvg, w: 499 / A_UNIT, h: 496 / A_UNIT },
  { src: periodSvg, w: 103 / A_UNIT, h: 103 / A_UNIT },
  { src: aSvg, w: 499 / A_UNIT, h: 496 / A_UNIT },
  { src: periodSvg, w: 103 / A_UNIT, h: 103 / A_UNIT },
  { src: aSvg, w: 499 / A_UNIT, h: 496 / A_UNIT },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const word = wordRef.current;
    if (!footer || !word) return;
    const nav = document.querySelector<HTMLElement>("[data-navbar]");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const MIN_SCALE = 0.3;

    // Gap (px) left between each pair of glyphs once fully enlarged.
    const FULL_GAP = 20;

    // The font-size (px) at which the five glyph widths fill the row minus the
    // FULL_GAP slack between each pair, so justify-between distributes exactly
    // FULL_GAP between every character. Reserve that full height up front so the
    // row never reflows (a changing height would feed back into the scroll
    // progress below).
    let fillSize = 0;
    let ticking = false;

    const measure = () => {
      const W = word.clientWidth;
      const chars = Array.from(word.children) as HTMLElement[];
      const REF = 100; // linear reference size: widths scale with font-size
      word.style.height = "auto";
      word.style.lineHeight = "100%";
      word.style.fontSize = `${REF}px`;
      const sum = chars.reduce((t, c) => t + c.offsetWidth, 0);
      const hRef = word.offsetHeight;
      if (sum > 0) {
        const gaps = FULL_GAP * (chars.length - 1);
        fillSize = (REF * Math.max(0, W - gaps)) / sum;
        word.style.height = `${(hRef * fillSize) / REF}px`;
      }
    };

    const update = () => {
      ticking = false;

      // Hide the fixed navbar once the footer is reached (its top rises past
      // the middle of the viewport), and restore it on the way back up. Guarded
      // so a short page never hides the navbar while resting at the top.
      if (nav) {
        const reached =
          footer.getBoundingClientRect().top < window.innerHeight * 0.5;
        const atTop = window.scrollY < 50;
        const hide = reached && !atTop;
        // Slide the navbar up when hiding, but snap it back instantly when
        // reappearing: a slide-down would briefly open a gap between the navbar
        // and the sticky project info as its bottom edge animates into place.
        nav.style.transition = hide
          ? "gap 0.05s linear, transform 0.4s ease"
          : "gap 0.05s linear";
        nav.style.transform = hide ? "translateY(-100%)" : "translateY(0)";
      }

      // Grow the wordmark into place as it enters from the bottom. Progress
      // runs 0→1 as the (fixed-height) row scrolls fully into view; font-size
      // animates from MIN_SCALE up to fillSize, where the characters meet edge
      // to edge with no gaps.
      const r = word.getBoundingClientRect();
      const p = reduce
        ? 1
        : Math.min(1, Math.max(0, (window.innerHeight - r.top) / r.height));
      word.style.fontSize = `${fillSize * (MIN_SCALE + (1 - MIN_SCALE) * p)}px`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (nav) nav.style.transform = "translateY(0)";
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="flex flex-col justify-between min-h-[max(100vh,600px)] pb-2 px-2 bg-green mt-[50vh]"
    >
      <div className=" pt-2 tracking-[-0.01em]">
        <NavMenu />
      </div>

      <div
        ref={wordRef}
        className="flex justify-between items-end w-full"
        style={{ willChange: "font-size" }}
        role="img"
        aria-label="Applied Archive Atelier"
      >
        {GLYPHS.map((g, i) => (
          <img
            key={i}
            src={g.src}
            alt=""
            aria-hidden="true"
            className="block"
            style={{ width: `${g.w}em`, height: `${g.h}em` }}
          />
        ))}
      </div>
    </footer>
  );
}
