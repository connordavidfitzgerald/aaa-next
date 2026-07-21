import { useEffect, type MouseEvent } from "react";

import { useTitle } from "@/lib/useTitle";
import {
  TERMS_EFFECTIVE,
  TERMS_PREAMBLE,
  TERMS_SECTIONS,
  TERMS_VERSION,
  type Block,
} from "@/lib/terms";

// Paragraphs and bulleted lists share the same measure; lists are indented by a
// hanging marker so they read as a break in the paragraph flow.
function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, i) =>
        Array.isArray(block) ? (
          <ul key={i} className="flex flex-col pl-3">
            {block.map((item, j) => (
              <li key={j} className="relative">
                <span className="absolute -left-3">—</span>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>{block}</p>
        ),
      )}
    </div>
  );
}

type LenisOpts = { immediate?: boolean; duration?: number };
type LenisLike = { scrollTo: (t: number, o?: LenisOpts) => void };

// Jumping to a section is a moving target. A section's scroll-margin is tied to
// --nav-height, but the jump itself is what changes that: scrolling past 50px
// collapses the navbar's submenus (a 300ms transition, see Navbar.tsx) and
// shrinks the wordmark. So the offset measured at click time is stale by the
// time you land — which is why a second click, made with the navbar already
// settled, used to be the one that landed correctly.
//
// So: jump, wait for the navbar to actually stop resizing, then ease out
// whatever difference that resize introduced.
function jumpToSection(e: MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  // Prefer the shared Lenis instance so the smooth-scroll engine stays in sync
  // (the same handling ScrollManager uses for hash navigation).
  const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
  const nav = document.querySelector<HTMLElement>("[data-navbar]");

  // Lenis ignores CSS scroll-margin, so read it and apply it ourselves; the
  // stylesheet stays the single source of truth for the offset.
  const targetFor = () => {
    const smt = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - smt);
  };

  const go = (to: number, smooth: boolean) => {
    if (lenis) lenis.scrollTo(to, smooth ? { duration: 0.4 } : { immediate: true });
    else window.scrollTo({ top: to, behavior: smooth ? "smooth" : "auto" });
  };

  // First pass — gets you there, and puts the navbar into its scrolled state.
  go(targetFor(), false);

  // Second pass — correct once the navbar has settled. Bail out if the reader
  // takes over scrolling in the meantime; their input wins over our correction.
  let done = false;
  const abort = () => {
    done = true;
  };
  const events = ["wheel", "touchstart", "keydown"] as const;
  events.forEach((ev) =>
    window.addEventListener(ev, abort, { once: true, passive: true }),
  );
  const finish = () => {
    events.forEach((ev) => window.removeEventListener(ev, abort));
    // Record the section in the URL without going through the router, so
    // ScrollManager doesn't run its own jump on top of this one.
    history.replaceState(null, "", `#${id}`);
  };

  // Measure the navbar directly rather than reading --nav-height: that variable
  // is deliberately frozen while the navbar is hovered, and it lags the element
  // by a frame besides.
  let lastHeight = -1;
  let steady = 0;
  const startedAt = performance.now();
  const settle = () => {
    if (done) return finish();
    const h = nav?.getBoundingClientRect().height ?? 0;
    steady = h === lastHeight ? steady + 1 : 0;
    lastHeight = h;
    // Five identical frames, or a cap comfortably past the 300ms submenu
    // transition, means the navbar has stopped moving.
    if (steady < 5 && performance.now() - startedAt < 800) {
      requestAnimationFrame(settle);
      return;
    }
    const to = targetFor();
    // Ease the leftover distance so the correction reads as a settle rather
    // than a second jump.
    if (Math.abs(to - window.scrollY) > 1) go(to, true);
    finish();
  };
  requestAnimationFrame(settle);
}

export function TermsPage() {
  useTitle("Applied Archive Atelier — Service Terms");

  // Flag the page on <html> so the navbar sits on the same green ground as the
  // page and flips its hover treatment (see index.css), the way the footer does.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-terms", "");
    return () => root.removeAttribute("data-terms");
  }, []);

  return (
    <main className="flex flex-col justify-start px-2 w-full min-h-screen bg-green text-black text-xs leading-[115%] tracking-[-0.01em] md:pt-[calc(var(--nav-height)*1.2)] pb-2">
      <div className="grid grid-cols-18 gap-2 flex-1 min-h-0">
        {/* Masthead + index. Sticks alongside the clauses on desktop, the same
            way the initiatives page holds its intro column. */}
        <aside
          data-sticky-info
          className="md:col-span-4 col-span-18 self-start flex flex-col justify-start gap-2 pb-4 md:pb-0 bg-green sticky md:top-[calc(var(--nav-height))] top-0 z-40"
        >
          <div className="flex md:hidden h-[calc(var(--nav-height))]"></div>
          <h1 className="uppercase">Service Terms</h1>
          <p className="opacity-70">
            Version {TERMS_VERSION} · Effective {TERMS_EFFECTIVE}
          </p>
          <nav className="hidden md:flex flex-col pt-2">
            {TERMS_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => jumpToSection(e, section.id)}
                data-nav-link
                className="relative flex items-center w-fit"
              >
                <span
                  data-nav-hl
                  className="absolute inset-0 bg-black scale-y-0 origin-top"
                />
                <span className="relative z-10">
                  {section.number}. {section.title}
                </span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="col-span-18 md:col-start-7 md:col-span-12 flex flex-col gap-6 h-fit">
          {/* Preamble — sits above the numbered clauses, starting at the label
              column so its left edge lines up with the section titles. */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <Blocks blocks={TERMS_PREAMBLE} />
            </div>
          </div>

          {TERMS_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="grid grid-cols-12 gap-2 scroll-mt-[calc(var(--nav-height)+1rem)]"
            >
              <h2 className="col-span-12 md:col-span-2 uppercase">
                {section.number}. {section.title}
              </h2>
              <div className="col-span-12 md:col-span-10">
                <Blocks blocks={section.blocks} />
              </div>
            </section>
          ))}

          <p className="opacity-70 pt-4">
            Questions about these Terms:{" "}
            <a
              href="mailto:info@appliedarchiveatelier.com"
              data-nav-link
              className="relative inline-flex items-center w-fit"
            >
              <span
                data-nav-hl
                className="absolute inset-0 bg-black scale-y-0 origin-top"
              />
              <span className="relative z-10">
                info@appliedarchiveatelier.com
              </span>
            </a>
          </p>
        </div>
        <div className="h-40"></div>
      </div>
    </main>
  );
}
