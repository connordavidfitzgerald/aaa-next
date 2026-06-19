import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LenisInit } from "@/components/LenisInit";
import { NavInteractions } from "@/components/NavInteractions";

type Lenis = { scrollTo: (t: number | string | HTMLElement) => void };

// Replaces Next's automatic scroll handling: jump to top on navigation, or to
// the targeted element when the URL carries a hash. Uses the shared Lenis
// instance when present so the smooth-scroll engine stays in sync.
function ScrollManager() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        const lenis = (window as unknown as { lenis?: Lenis }).lenis;
        if (hash) {
            const el = document.querySelector(hash);
            if (el) {
                if (lenis) lenis.scrollTo(el as HTMLElement);
                else el.scrollIntoView();
                return;
            }
        }
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo(0, 0);
    }, [pathname, hash]);

    return null;
}

export function Layout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
            <LenisInit />
            <NavInteractions />
            <ScrollManager />
        </>
    );
}
