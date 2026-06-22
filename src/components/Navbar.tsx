import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { NavMenu } from "@/components/NavMenu";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  // Synchronous mirror of `hovered` for the ResizeObserver closure, which is
  // created once and must read the latest value without re-subscribing.
  const hoveredRef = useRef(false);
  // Lets the pointer handlers trigger a height measurement after the collapse
  // animation, and cancel a pending one if the pointer returns.
  const measureRef = useRef<() => void>(() => {});
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  // The submenu lists show when resting at the top of the page, or whenever the
  // pointer is over the navbar; otherwise the menu collapses to its headers.
  const expanded = !scrolled || hovered;

  useEffect(() => {
    const nav = navRef.current;
    const root = document.documentElement;
    if (!nav) return;

    const SCROLL_RANGE = 800;
    const COLLAPSE_AT = 50;
    let ticking = false;

    const updateShrink = () => {
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

  return (
    <nav
      ref={navRef}
      data-navbar
      onMouseEnter={() => {
        if (leaveTimer.current) {
          clearTimeout(leaveTimer.current);
          leaveTimer.current = null;
        }
        hoveredRef.current = true;
        setHovered(true);
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
