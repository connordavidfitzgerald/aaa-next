import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Phases of a page transition:
//  - cover : the white sheet rises from the bottom to the top of the screen
//  - hold  : screen is fully covered; the new route is committed and scrolled
//            to its landing position (top, or a hash target)
//  - reveal: the sheet wipes back down, uncovering the new page from the top
// The Navbar reads this phase to force its shrunk state while covered and let
// it expand again as the page is revealed (see Navbar.tsx).
export type TransitionPhase = "idle" | "cover" | "hold" | "reveal";

const PageTransitionContext = createContext<TransitionPhase>("idle");

export const usePageTransition = () => useContext(PageTransitionContext);

const COVER_DURATION = 0.8; // seconds, sheet rise / wipe
const HOLD_DURATION = 50; // ms the screen stays fully covered

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const overlayRef = useRef<HTMLDivElement>(null);
  // Guards against starting a second transition while one is mid-flight.
  const runningRef = useRef(false);
  // Latest location, read by the (stable) click interceptor closure to decide
  // whether a click is an in-page navigation that should be left alone.
  const locationRef = useRef(location);
  locationRef.current = location;

  const run = useCallback(
    async (to: string) => {
      if (runningRef.current) return;

      // Respect reduced-motion: navigate immediately with no cover.
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const overlay = overlayRef.current;
      if (reduce || !overlay) {
        navigate(to);
        return;
      }

      runningRef.current = true;
      const { gsap } = await import("gsap");

      // 1. Cover — the sheet rises from the bottom to fully cover the screen.
      setPhase("cover");
      gsap.set(overlay, {
        visibility: "visible",
        pointerEvents: "auto",
        yPercent: 100,
      });
      await gsap.to(overlay, {
        yPercent: 0,
        duration: COVER_DURATION,
        ease: "power3.out",
      });

      // 2. Hold — fully covered: commit the route and let ScrollManager land it
      //    at the top (or hash target) before we uncover.
      setPhase("hold");
      navigate(to);
      await new Promise((resolve) => setTimeout(resolve, HOLD_DURATION));

      // 3. Reveal — the sheet wipes back down, uncovering the new page from the
      //    top; the Navbar expands in step (it reacts to the "reveal" phase).
      setPhase("reveal");
      await gsap.to(overlay, {
        yPercent: 100,
        duration: COVER_DURATION,
        ease: "power3.inOut",
      });

      gsap.set(overlay, { visibility: "hidden", pointerEvents: "none" });
      setPhase("idle");
      runningRef.current = false;
    },
    [navigate],
  );

  // Intercept clicks on internal links anywhere in the app and route them
  // through the cover transition, so we don't have to wrap every <Link>. A
  // capture-phase listener runs before React Router's own handler; stopping
  // propagation prevents its default navigation so ours takes over.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href === null) return;

      const targetAttr = anchor.getAttribute("target");
      if (targetAttr && targetAttr !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      // Escape hatch: opt a link out of the transition with data-no-transition.
      if (anchor.dataset.noTransition !== undefined) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      // External links open normally.
      if (url.origin !== window.location.origin) return;

      // Same-page navigation (in-page hash, or a link to the current URL): let
      // React Router/the browser handle scrolling — no full-screen cover.
      const current = locationRef.current;
      if (url.pathname === current.pathname && url.search === current.search) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      run(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [run]);

  return (
    <PageTransitionContext.Provider value={phase}>
      {children}
      {/* The cover sheet. Sits below the navbar (z-50) so the navbar stays on
          top and visibly shrinks while the rest of the page is covered. The
          resting (hidden) state lives in className so React never reasserts it;
          GSAP exclusively owns transform/visibility/pointer-events as inline
          styles from here, which a re-render won't clobber. */}
      <div
        ref={overlayRef}
        aria-hidden
        className="invisible pointer-events-none fixed inset-0 z-40 bg-white"
        style={{ willChange: "transform" }}
      />
    </PageTransitionContext.Provider>
  );
}
