"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const navHl = (
    <span
        data-nav-hl
        className="absolute inset-0 bg-green scale-y-0 origin-top"
    />
);

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
                transition: "gap 0.05s linear",
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
            <div className="grid grid-cols-18 gap-2 text-xs leading-[120%] border-b-black">
                <div className="col-span-4 grid grid-cols-2 gap-2">
                    <Link
                        href="/#projects"
                        data-nav-link
                        data-nav-header
                        className="relative opacity-70 flex items-start w-fit h-fit col-span-2 md:col-span-1"
                    >
                        {navHl}
                        <span className="relative z-10">Selected Projects</span>
                    </Link>
                    <div className="hidden md:flex flex-col w-full">
                        {[
                            { href: "/projects/bxb", label: "Brique par brique" },
                            { href: "/projects/chimie", label: "Chimie" },
                            { href: "/projects/ctrl", label: "CTRL+ALT" },
                            { href: "/projects/ecozoic", label: "Ecozoic" },
                            { href: "/projects/ellipse", label: "Ellipse Magazine" },
                        ].map((p) => (
                            <Link
                                key={p.href}
                                href={p.href}
                                data-nav-link
                                className="relative flex items-center w-fit"
                            >
                                {navHl}
                                <span className="relative z-10">{p.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="col-span-4 grid grid-cols-2 gap-2">
                    <Link
                        href="/manifesto"
                        data-nav-link
                        data-nav-header
                        className="relative opacity-70 flex items-start w-fit h-fit col-span-2 md:col-span-1"
                    >
                        {navHl}
                        <span className="relative z-10">Manifesto</span>
                    </Link>
                    <div className="hidden md:flex flex-col w-full">
                        {[
                            { href: "/manifesto#welcome", label: "Welcome" },
                            { href: "/manifesto#craft", label: "Craft" },
                            { href: "/manifesto#amplify", label: "Amplify" },
                            { href: "/manifesto#cultivate", label: "Cultivate" },
                        ].map((m) => (
                            <Link
                                key={m.href}
                                href={m.href}
                                data-nav-link
                                className="relative flex items-center w-fit"
                            >
                                {navHl}
                                <span className="relative z-10">{m.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="col-span-4 grid grid-cols-2 gap-2">
                    <Link
                        href="/team"
                        data-nav-link
                        data-nav-header
                        className="relative opacity-70 flex items-start w-fit h-fit col-span-2 md:col-span-1"
                    >
                        {navHl}
                        <span className="relative z-10">Team</span>
                    </Link>
                    <div className="hidden md:flex flex-col w-full">
                        {[
                            { href: "/team/jean-julien", label: "Jean-Julien Hazoumé" },
                            { href: "/team/luckensy", label: "Luckensy Odigé" },
                            { href: "/team/jordane", label: "Jordane Kaluma" },
                            { href: "/team/reatchy", label: "Reatchy Legros" },
                            { href: "/team/johnelle", label: "Johnelle Smith" },
                        ].map((m) => (
                            <Link
                                key={m.href}
                                href={m.href}
                                data-nav-link
                                className="relative flex items-center w-fit"
                            >
                                {navHl}
                                <span className="relative z-10">{m.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="col-span-4 grid grid-cols-2 gap-2">
                    <Link
                        href="/initiatives"
                        data-nav-link
                        data-nav-header
                        className="relative opacity-70 flex items-start w-fit h-fit col-span-2 md:col-span-1"
                    >
                        {navHl}
                        <span className="relative z-10">Initiatives</span>
                    </Link>
                    <div className="hidden md:flex flex-col w-full">
                        <a
                            href="https://www.instagram.com/gia.grants/"
                            data-nav-link
                            className="relative flex items-center w-fit"
                        >
                            {navHl}
                            <span className="relative z-10">Gia</span>
                        </a>
                        <a
                            href="https://djt.al"
                            data-nav-link
                            className="relative flex items-center w-fit"
                        >
                            {navHl}
                            <span className="relative z-10">DJTAL</span>
                        </a>
                        <span
                            data-nav-link
                            className="relative flex items-center w-fit h-fit"
                        >
                            {navHl}
                            <span className="relative z-10">Espace Septima</span>
                        </span>
                    </div>
                </div>
                <div className="col-span-2 flex flex-row justify-end items-start">
                    <Link
                        href="/contact"
                        data-nav-link
                        className="relative flex items-center justify-end w-fit"
                    >
                        {navHl}
                        <span className="relative z-10">
                            <span className="md:hidden text-nowrap">
                                Let&apos;s talk{" "}
                                <span className="text-[10px]">↗</span>
                            </span>
                            <span className="hidden md:inline">
                                Start a{" "}
                                <span className="text-nowrap">
                                    conversation{" "}
                                    <span className="text-[10px]">↗</span>
                                </span>
                            </span>
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
