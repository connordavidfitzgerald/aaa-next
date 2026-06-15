"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function NavInteractions() {
    const pathname = usePathname();

    useEffect(() => {
        const cleanups: Array<() => void> = [];
        let cancelled = false;

        (async () => {
            const { gsap } = await import("gsap");
            if (cancelled) return;

            const links =
                document.querySelectorAll<HTMLElement>("[data-nav-link]");

            links.forEach((link) => {
                const hl =
                    link.querySelector<HTMLElement>("[data-nav-hl]");
                if (!hl) return;

                gsap.set(hl, { scaleY: 0, transformOrigin: "center top" });

                const handleEnter = () => {
                    if (link.hasAttribute("data-nav-header")) {
                        link.classList.remove("opacity-70");
                    }
                    gsap.to(hl, {
                        scaleY: 1,
                        transformOrigin: "center top",
                        duration: 0.25,
                        ease: "power3.out",
                        overwrite: true,
                    });
                };

                const handleLeave = () => {
                    if (link.hasAttribute("data-nav-header")) {
                        link.classList.add("opacity-70");
                    }
                    gsap.to(hl, {
                        scaleY: 0,
                        transformOrigin: "center bottom",
                        duration: 0.05,
                        delay: 0,
                        ease: "power3.out",
                        overwrite: true,
                    });
                };

                link.addEventListener("mouseenter", handleEnter);
                link.addEventListener("mouseleave", handleLeave);

                cleanups.push(() => {
                    link.removeEventListener("mouseenter", handleEnter);
                    link.removeEventListener("mouseleave", handleLeave);
                });
            });
        })();

        return () => {
            cancelled = true;
            cleanups.forEach((fn) => fn());
        };
    }, [pathname]);

    return null;
}
