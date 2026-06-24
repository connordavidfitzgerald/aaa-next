import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { NavMenu } from "@/components/NavMenu";
import { usePageTransition } from "@/components/PageTransition";

// Scroll distance (px) over which the header interpolates to its shrunk size,
// and the scroll past which the submenus collapse to their headers.
const SCROLL_RANGE = 800;
const COLLAPSE_AT = 50;

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  // Synchronous mirror of `hovered` for the ResizeObserver closure, which is
  // created once and must read the latest value without re-subscribing.
  const hoveredRef = useRef(false);
  // Lets the pointer handlers trigger a height measurement after the collapse
  // animation, and cancel a pending one if the pointer returns.
  const measureRef = useRef<() => void>(() => {});
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // While true, the scroll handler stops writing --nav-shrink so the page
  // transition can drive (and hold) the shrunk state itself.
  const forcingRef = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  const phase = usePageTransition();
  // The page transition collapses the submenu items as the cover rises and
  // re-expands them a beat into the reveal, in step with the header growing
  // back (driven by the phase effect below, not by the phase directly, so the
  // reveal can be delayed to match the shrink tween's delay).
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  // The submenu lists show when resting at the top of the page, or whenever the
  // pointer is over the navbar; otherwise the menu collapses to its headers.
  const expanded = menuCollapsed ? false : !scrolled || hovered;

  useEffect(() => {
    const nav = navRef.current;
    const root = document.documentElement;
    if (!nav) return;

    let ticking = false;

    const updateShrink = () => {
      // The page transition owns --nav-shrink while it forces the shrunk state.
      if (forcingRef.current) {
        ticking = false;
        return;
      }
      const y = window.scrollY;
      const progress = Math.min(1, Math.max(0, y / SCROLL_RANGE));
      root.style.setProperty("--nav-shrink", progress.toString());
      setScrolled(y > COLLAPSE_AT);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateShrink);
    };

    const updateHeight = () => {
      // Freeze the reserved height while the menu is expanded on hover (and
      // through the collapse animation on leave) so the dropdown overlays the
      // page rather than pushing content down, and the sticky project info
      // doesn't jump as the nav animates back to its resting height.
      if (hoveredRef.current) return;
      root.style.setProperty(
        "--nav-height",
        `${nav.getBoundingClientRect().height}px`,
      );
    };
    measureRef.current = updateHeight;

    updateShrink();
    updateHeight();
    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateHeight);
    ro.observe(nav);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  // Drive the shrink during a page transition: collapse to the shrunk header as
  // the cover rises, then animate back to the new page's scroll-based size as
  // it's revealed. While forcing, the scroll handler leaves --nav-shrink to us.
  useEffect(() => {
    if (phase !== "cover" && phase !== "reveal") return;

    const root = document.documentElement;
    let cancelled = false;

    // Reveal lands on the new page; reflect its actual scroll position so the
    // header expands at the top but stays shrunk if we landed mid-page (hash).
    const y = phase === "reveal" ? window.scrollY : 0;
    const target =
      phase === "cover" ? 1 : Math.min(1, Math.max(0, y / SCROLL_RANGE));

    if (phase === "cover") {
      forcingRef.current = true;
      // Collapse the submenu items immediately as the cover begins.
      setMenuCollapsed(true);
    } else {
      setScrolled(y > COLLAPSE_AT);
    }

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      const proxy = {
        v:
          parseFloat(getComputedStyle(root).getPropertyValue("--nav-shrink")) ||
          0,
      };
      gsap.to(proxy, {
        v: target,
        duration: 0.7,
        delay: 0.2,
        ease: "power2.out",
        overwrite: true,
        // onStart fires after the delay — so on reveal the items re-expand at
        // the same moment the header starts growing back. (Driven by the tween
        // rather than a timer so it survives the phase flipping to idle.)
        onStart: () => {
          if (phase === "reveal") setMenuCollapsed(false);
        },
        onUpdate: () => root.style.setProperty("--nav-shrink", String(proxy.v)),
        onComplete: () => {
          // Hand control back to the scroll handler once revealed.
          if (phase === "reveal") forcingRef.current = false;
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [phase]);

  return (
    <nav
      ref={navRef}
      data-navbar
      onMouseEnter={() => {
        // Re-entering cancels a pending collapse; the actual expand is gated by
        // pointer position in onMouseMove below.
        if (leaveTimer.current) {
          clearTimeout(leaveTimer.current);
          leaveTimer.current = null;
        }
      }}
      onMouseMove={(e) => {
        // Only expand when the pointer is at or above the menu-headers row, so
        // hovering just below the collapsed navbar doesn't trigger it. Once
        // open, onMouseLeave (on the whole nav) keeps the submenus hoverable.
        if (hoveredRef.current) return;
        const nav = navRef.current;
        const header = nav?.querySelector<HTMLElement>("[data-nav-header]");
        const limit = header ? header.getBoundingClientRect().bottom : Infinity;
        if (e.clientY <= limit) {
          hoveredRef.current = true;
          setHovered(true);
        }
      }}
      onMouseLeave={() => {
        // Start the collapse, but keep the height frozen until the 300ms
        // submenu transition has settled, then take one clean measurement.
        setHovered(false);
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
        leaveTimer.current = setTimeout(() => {
          hoveredRef.current = false;
          measureRef.current();
          leaveTimer.current = null;
        }, 350);
      }}
      className="fixed top-0 left-0 w-full px-2 pt-2 pb-1.5 tracking-[-0.01em] flex flex-col justify-start font-sans z-50"
      style={{
        background: "var(--nav-bg)",
        gap: "5px",
        transition: "gap 0.05s linear, transform 0.4s ease",
      }}
    >
      <Link
        to="/"
        className="col-span-12 flex flex-row w-full justify-between items-start h-fit leading-[82%] tracking-[-0.04em]"
        style={{
          fontSize:
            "calc(var(--text-header) * (1 - var(--nav-shrink)) + var(--text-sm) * var(--nav-shrink))",
        }}
      >
        <h1 className="font-bold text-left flex grow">APPLIED</h1>
        <h1 className="font-bold text-center flex grow">ARCHIVE</h1>
        <h1 className="font-bold text-right">ATELIER</h1>
      </Link>
      <NavMenu expanded={expanded} />
    </nav>
  );
}
