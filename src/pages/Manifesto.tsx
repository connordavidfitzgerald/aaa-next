import { Fragment, useEffect, useMemo, useRef } from "react";
import { MuxAutoPlayer } from "@/components/MuxAutoPlayer";
import { useSiteContent } from "@/lib/SiteContentProvider";
import { useTitle } from "@/lib/useTitle";
import { useT } from "@/lib/SiteContentProvider";

// clip-path states: hidden collapses the line to its left edge; shown reveals
// the whole line. Animating between them wipes the green+text in left→right.
const HIDDEN = "inset(-1% 100% -1% 0%)";
const SHOWN = "inset(-1% 0% -1% 0%)";

// Split a sentence-y string into separate display lines (after each period) so
// the poetic scroll reveals one clause at a time.
const toClauses = (text: string) =>
  text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

export function ManifestoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { content } = useSiteContent();
  const t = useT();
  useTitle(`Applied Archive Atelier — ${t("titleManifesto")}`);

  const manifesto = content?.manifesto;

  // The poetic scroll at the top is derived from the manifesto stanzas (a blank
  // line between each), then the approach section, so the copy is only authored
  // once in the CMS.
  const lines = useMemo<string[]>(() => {
    if (!manifesto) return [];
    const out: string[] = [];
    manifesto.stanzas.forEach((stanza) => {
      stanza.split("\n").forEach((l) => out.push(l));
      out.push("");
    });
    out.push("", "", "");
    if (manifesto.approachLabel) out.push(manifesto.approachLabel, "", "");
    manifesto.approach.forEach((a) => {
      out.push(`${a.term}.`);
      toClauses(a.description).forEach((c) => out.push(c));
      out.push("");
    });
    return out;
  }, [manifesto]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || lines.length === 0) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const els = gsap.utils.toArray<HTMLElement>("[data-line]", root);

      // Reduced motion: show everything, no scroll-driven wipe.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        els.forEach((el) => gsap.set(el, { clipPath: SHOWN }));
        return;
      }

      els.forEach((el) => {
        const tween = gsap.fromTo(
          el,
          { clipPath: HIDDEN },
          {
            clipPath: SHOWN,
            ease: "none",
            scrollTrigger: {
              trigger: el,
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
  }, [lines]);

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
          {lines.map((line, i) =>
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
            18-column grid: Approach (4) · Manifesto (6) · Capabilities (8). */}
        <section className="w-full h-screen flex flex-col gap-0 justify-start">
          <div className="h-[calc(var(--nav-height))]"></div>
          <div className="grid grid-cols-18 gap-2 gap-y-6 text-xs leading-[1.2] tracking-[-0.01em] bg-green px-2 pt-2 grow">
            {/* Approach */}
            <div className="col-span-18 md:col-span-4 flex flex-col gap-2">
              <p className="pb-1  border-b border-black/20">
                {manifesto?.approachLabel}
              </p>
              <div className="flex flex-col gap-2">
                {manifesto?.approach.map(({ term, description }) => (
                  <div key={term} className="flex flex-col">
                    <p>{term}</p>
                    <p className="">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manifesto */}
            <div className="col-span-18 md:col-span-8 flex flex-col gap-2">
              <p className="pb-0.5 md:pb-1 border-b border-black/20">
                {manifesto?.stanceLabel}
              </p>
              <div className="flex flex-col gap-[1.2em]">
                {manifesto?.stanzas.map((stanza, i) => {
                  const stanzaLines = stanza.split("\n");
                  return (
                    <p key={i}>
                      {stanzaLines.map((l, j) => (
                        <Fragment key={j}>
                          {l}
                          {j < stanzaLines.length - 1 && <br />}
                        </Fragment>
                      ))}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Capabilities */}
            <div className="col-span-18 md:col-span-6 flex flex-col gap-2">
              <p className="pb-0.5 md:pb-1 border-b border-black/20">
                {manifesto?.capabilitiesLabel}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
                {manifesto?.capabilities.map(({ title, items }) => (
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
          <div className="flex absolute bottom-0">
            <section id="capabilities" /> <section id="manifesto" />{" "}
            <section id="approach" />
          </div>
        </section>
      </div>
    </main>
  );
}
