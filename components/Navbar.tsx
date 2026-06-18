"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { NavMenu } from "@/components/NavMenu";

export function Navbar() {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const nav = navRef.current;
        const root = document.documentElement;
        if (!nav) return;

        const SCROLL_RANGE = 800;
        let ticking = false;

        const updateShrink = () => {
            const progress = Math.min(
                1,
                Math.max(0, window.scrollY / SCROLL_RANGE),
            );
            root.style.setProperty("--nav-shrink", progress.toString());
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateShrink);
        };

        const updateHeight = () => {
            root.style.setProperty(
                "--nav-height",
                `${nav.getBoundingClientRect().height}px`,
            );
        };

        updateShrink();
        updateHeight();
        window.addEventListener("scroll", onScroll, { passive: true });
        const ro = new ResizeObserver(updateHeight);
        ro.observe(nav);

        return () => {
            window.removeEventListener("scroll", onScroll);
            ro.disconnect();
        };
    }, []);

    return (
        <nav
            ref={navRef}
            data-navbar
            className="fixed top-0 left-0 w-full p-2 flex flex-col justify-start font-sans z-50"
            style={{
                background: "var(--nav-bg)",
                gap: "var(--nav-gap)",
                transition: "gap 0.05s linear, transform 0.4s ease",
            }}
        >
            <Link
                href="/"
                className="col-span-12 flex flex-row w-full justify-between items-start h-fit leading-[82%] tracking-[-0.05em]"
                style={{
                    fontSize:
                        "calc(var(--text-header) * (1 - var(--nav-shrink)) + var(--text-md) * var(--nav-shrink))",
                }}
            >
                <h1 className="font-bold text-left flex grow">APPLIED</h1>
                <h1 className="font-bold text-center flex grow">ARCHIVE</h1>
                <h1 className="font-bold text-right">ATELIER</h1>
            </Link>
            <NavMenu />
        </nav>
    );
}
