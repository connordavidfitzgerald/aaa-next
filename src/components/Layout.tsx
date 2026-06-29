import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LenisInit } from "@/components/LenisInit";
import { NavInteractions } from "@/components/NavInteractions";

type Lenis = {
  scrollTo: (
    t: number | string | HTMLElement,
    opts?: { immediate?: boolean },
  ) => void;
};

// Replaces Next's automatic scroll handling: jump to top on navigation, or to
// the targeted element when the URL carries a hash. Uses the shared Lenis
// instance when present so the smooth-scroll engine stays in sync.
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    // Jumps are immediate: during a page transition this runs while the screen
    // is covered, so we want the new page already at its landing position
    // (top, or the hash target) by the time the cover wipes away.
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        if (lenis) lenis.scrollTo(el as HTMLElement, { immediate: true });
        else el.scrollIntoView();
        return;
      }
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export function Layout() {
  const { pathname } = useLocation();
  // No footer on the contact and about pages (in either language); the member
  // view (/team/:slug) and every other page keep it. Strip the /fr locale prefix
  // so both language trees match.
  const bare = pathname.replace(/^\/fr(?=\/|$)/, "") || "/";
  const hideFooter = bare === "/contact" || bare === "/about";

  return (
    <>
      <Navbar />
      {/* Opaque layer above the fixed footer (z-10 > footer z-0): it
                covers the footer until the page's bottom spacer scrolls up and
                reveals it. */}
      <div className="relative z-10 min-h-screen bg-white">
        <Outlet />
      </div>
      {!hideFooter && <Footer />}
      <LenisInit />
      <NavInteractions />
      <ScrollManager />
    </>
  );
}
