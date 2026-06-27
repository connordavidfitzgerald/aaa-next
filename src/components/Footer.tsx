import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import { NavMenu } from "@/components/NavMenu";
import { usePageTransition } from "@/components/PageTransition";
import { useLocale, type Lang } from "@/lib/locale";
import aSvg from "@/assets/svgs/A.svg";
import periodSvg from "@/assets/svgs/period.svg";

// EN / FR switch: links to the current page in the other language and saves the
// choice so the auto-detect never overrides it.
function LangToggle() {
  const { lang, otherLang, otherLangPath, persist } = useLocale();
  const render = (l: Lang) =>
    l === lang ? (
      <span className="font-bold">{l.toUpperCase()}</span>
    ) : (
      <Link
        to={otherLangPath}
        onClick={() => persist(otherLang)}
        data-no-transition
        className="opacity-50 hover:opacity-100"
      >
        {l.toUpperCase()}
      </Link>
    );
  return (
    <div className="flex gap-1.5 text-xs" aria-label="Language">
      {render("en")}
      <span className="opacity-30">/</span>
      {render("fr")}
    </div>
  );
}

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
  const spacerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const phase = usePageTransition();
  // True while a page transition is mid-flight. The footer-reveal math relies on
  // the spacer's viewport position and the scroll offset; during a transition
  // the new page is briefly empty/short and the scroll is being reset, so those
  // reads are transient and can spuriously hide the navbar as the page appears.
  // We freeze the hide logic while transitioning and settle once it's idle.
  const transitioningRef = useRef(false);
  // Lets the phase effect re-run the latest `update()` (defined in the main
  // effect's closure) without re-subscribing the scroll listeners.
  const updateRef = useRef<() => void>(() => {});

  // Restore the navbar on navigation. The scroll handler below hides the fixed
  // navbar (translateY(-100%)) once the footer is reached, but that inline
  // transform lives on the persistent navbar element and would carry over to
  // the next page. Firefox fires a scroll event after the route's scroll-reset
  // that re-runs `update()` and clears it; Chrome doesn't, leaving the navbar
  // stuck hidden until the next manual scroll. Reset it here (without a
  // transition, so it never visibly slides) every time the route changes.
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("[data-navbar]");
    if (!nav) return;
    const prevTransition = nav.style.transition;
    nav.style.transition = "none";
    nav.style.transform = "translateY(0)";
    // Commit the no-transition reset before restoring transitions.
    void nav.offsetHeight;
    nav.style.transition = prevTransition;
  }, [pathname]);

  // Track the transition phase; when it returns to idle, recompute the resting
  // navbar/wordmark state for the page we landed on.
  useEffect(() => {
    transitioningRef.current = phase !== "idle";
    if (phase === "idle") updateRef.current();
  }, [phase]);

  useEffect(() => {
    const footer = footerRef.current;
    const spacer = spacerRef.current;
    const word = wordRef.current;
    if (!footer || !spacer || !word) return;
    const nav = document.querySelector<HTMLElement>("[data-navbar]");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Gap (px) left between each pair of glyphs once fully enlarged.
    const FULL_GAP = 20;

    // The font-size (px) at which the five glyph widths fill the row minus the
    // FULL_GAP slack between each pair, so justify-between distributes exactly
    // FULL_GAP between every character. Reserve that full height up front so the
    // row never reflows (a changing height would feed back into the scroll
    // progress below).
    let fillSize = 0;
    // Starting font-size (px): the glyphs begin the height of an "A" set in
    // text-xs / font-bold, so the wordmark matches the surrounding nav text
    // before it grows. The A fills its SVG box, so its rendered height equals
    // the font-size — measure the bold text-xs cap height and start there.
    let startSize = 11.5;
    let ticking = false;

    const measureStartSize = () => {
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      ctx.font = `700 ${25}px ${getComputedStyle(word).fontFamily}`;
      const m = ctx.measureText("A");
      const h =
        (m.actualBoundingBoxAscent || 0) + (m.actualBoundingBoxDescent || 0);
      if (h > 0) startSize = h;
    };

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
      measureStartSize();
    };

    const update = () => {
      ticking = false;

      // The footer is fixed behind the page; the in-flow spacer at the bottom
      // of the page is what scrolls, uncovering the footer as its top rises up
      // the viewport. Reveal progress runs 0→1 as the spacer's top travels from
      // the viewport bottom up by one footer height (the point at which the
      // page content has fully cleared the footer).
      const fh = footer.offsetHeight || window.innerHeight;
      const spTop = spacer.getBoundingClientRect().top;
      const p = reduce
        ? 1
        : Math.min(1, Math.max(0, (window.innerHeight - spTop) / fh));

      // Hide the fixed navbar and any sticky project-info headers together once
      // the footer is reached (the spacer's top rises past the middle of the
      // viewport), and restore them on the way back up. Guarded so a short page
      // never hides them while resting at the top.
      const reached = spTop < window.innerHeight * 0.5;
      const atTop = window.scrollY < 50;
      // Never hide mid-transition: the page is settling and the reads above are
      // transient (see transitioningRef note).
      const hide = reached && !atTop && !transitioningRef.current;

      if (nav) {
        // Slide the navbar and the sticky project info with the same 0.4s ease
        // in both directions so they hide and reappear in sync. They animate
        // together, so the navbar always covers the sticky header during the
        // transition and no gap opens between them.
        nav.style.transition = "gap 0.05s linear, transform 0.4s ease";
        nav.style.transform = hide ? "translateY(-100%)" : "translateY(0)";
      }

      // The sticky project-preview headers ride up with the navbar so the
      // preview clears the screen as the footer reveals. Queried each frame
      // since the previews mount/unmount across route changes while the footer
      // stays mounted. Move up by the full header height plus its sticky top
      // offset so it fully clears the top edge.
      const stickies =
        document.querySelectorAll<HTMLElement>("[data-sticky-info]");
      stickies.forEach((el) => {
        el.style.transition = "transform 0.4s ease";
        el.style.transform = hide
          ? "translateY(calc(-100% - var(--nav-height)))"
          : "translateY(0)";
      });

      // Grow the wordmark into place as the footer is revealed: font-size
      // animates from startSize (text-xs height) up to fillSize, where the
      // characters meet edge to edge with no gaps.
      word.style.fontSize = `${startSize + (fillSize - startSize) * p}px`;
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

    // Expose the latest update() so the phase effect can settle the navbar
    // once a transition finishes.
    updateRef.current = update;

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
    <>
      {/* In-flow spacer at the bottom of the page. It reserves the scroll room
          that uncovers the fixed footer sitting behind the page content. */}
      <div
        ref={spacerRef}
        aria-hidden="true"
        className="h-[max(100vh,600px)]"
      />
      {/* Fixed at z-0: above the in-flow spacer (so the revealed nav is
          clickable) but below the page content (z-10), which keeps it covered
          until the spacer scrolls up. */}
      <footer
        ref={footerRef}
        className="fixed inset-x-0 bottom-0 z-0 flex flex-col justify-between h-[max(100vh,600px)] pb-2 px-2 bg-green"
      >
        <div className=" pt-2 tracking-[-0.01em]">
          <NavMenu />
          <div className="flex justify-end pt-4">
            <LangToggle />
          </div>
        </div>

        <div
          ref={wordRef}
          className="flex justify-between items-end w-full "
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
              className="block px-0.5 "
              style={{ width: `${g.w}em`, height: `${g.h}em` }}
            />
          ))}
        </div>
      </footer>
    </>
  );
}
