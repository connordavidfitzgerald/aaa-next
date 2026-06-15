"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import manifestoBg from "@/assets/images/MANIFESTO.png";
import approachBg from "@/assets/images/APPROACH.png";

export default function ManifestoPage() {
    const rootRef = useRef<HTMLElement>(null);

    useEffect(() => {
        document.title = "Applied Archive Atelier — Manifesto";
        const html = document.documentElement;
        const prevNavBg = html.style.getPropertyValue("--nav-bg");
        const prevPageBg = html.style.getPropertyValue("--page-bg");
        html.style.setProperty("--nav-bg", "var(--color-green)");
        html.style.setProperty("--page-bg", "var(--color-green)");

        let cancelled = false;
        let cleanupGsap: (() => void) | null = null;

        (async () => {
            const { gsap } = await import("gsap");
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            if (cancelled) return;
            gsap.registerPlugin(ScrollTrigger);

            const pillars = gsap.utils.toArray<HTMLElement>("[data-pillar]");

            const isMobile = window.matchMedia("(max-width: 767px)").matches;
            const startYPercent = isMobile ? 220 : 130;
            gsap.set(pillars, { yPercent: startYPercent });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "[data-pillars-section]",
                    start: "top top",
                    end: "+=400%",
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    scrub: 0.3,
                    invalidateOnRefresh: true,
                },
            });

            pillars.forEach((pillar) => {
                tl.to(pillar, { yPercent: 0, duration: 1, ease: "none" });
            });

            const bgManifesto = document.querySelector<HTMLElement>(
                '[data-bg="manifesto"]',
            );
            const bgApproach = document.querySelector<HTMLElement>(
                '[data-bg="approach"]',
            );

            const bgTrigger = ScrollTrigger.create({
                trigger: "[data-pillars-section]",
                start: "top bottom",
                onEnter: () => {
                    gsap.to(bgManifesto, { opacity: 0, duration: 0.5 });
                    gsap.to(bgApproach, { opacity: 0.06, duration: 0.5 });
                },
                onLeaveBack: () => {
                    gsap.to(bgManifesto, { opacity: 0.06, duration: 0.5 });
                    gsap.to(bgApproach, { opacity: 0, duration: 0.5 });
                },
            });

            const pillarOrder = pillars
                .map((p) => p.dataset.pillar)
                .filter((n): n is string => Boolean(n));

            const scrollToPillar = (name: string) => {
                const idx = pillarOrder.indexOf(name);
                const trigger = tl.scrollTrigger;
                if (idx === -1 || !trigger) return;
                const progress = (idx + 1) / pillarOrder.length;
                const targetY =
                    trigger.start + (trigger.end - trigger.start) * progress;
                const lenis = (window as unknown as { lenis?: { scrollTo: (y: number, opts?: { immediate?: boolean }) => void } }).lenis;
                if (lenis?.scrollTo) {
                    lenis.scrollTo(targetY, { immediate: false });
                } else {
                    window.scrollTo({ top: targetY, behavior: "smooth" });
                }
            };

            const handleHash = () => {
                const name = window.location.hash.slice(1);
                if (name) scrollToPillar(name);
            };

            const onLoad = () => {
                ScrollTrigger.refresh();
                if (window.location.hash) {
                    requestAnimationFrame(handleHash);
                }
            };
            window.addEventListener("load", onLoad);
            window.addEventListener("hashchange", handleHash);

            // Trigger initial run-once
            ScrollTrigger.refresh();
            if (window.location.hash) requestAnimationFrame(handleHash);

            cleanupGsap = () => {
                window.removeEventListener("load", onLoad);
                window.removeEventListener("hashchange", handleHash);
                bgTrigger.kill();
                tl.scrollTrigger?.kill();
                tl.kill();
            };
        })();

        return () => {
            cancelled = true;
            cleanupGsap?.();
            html.style.setProperty("--nav-bg", prevNavBg || "white");
            html.style.setProperty("--page-bg", prevPageBg || "white");
        };
    }, []);

    return (
        <main
            ref={rootRef}
            className="flex flex-col justify-start px-2 w-full text-xs leading-[115%]"
        >
            <div className="fixed inset-0 translate-y-[40%] px-2 pb-2 pointer-events-none">
                <div className="relative w-full">
                    <Image
                        src={manifestoBg}
                        alt="Manifesto"
                        data-bg="manifesto"
                        className="w-full opacity-6 block"
                    />
                    <Image
                        src={approachBg}
                        alt="Approach"
                        data-bg="approach"
                        className="w-full opacity-0 absolute inset-0"
                    />
                </div>
            </div>

            <div className="grid grid-cols-18 gap-2 mt-[98vh] pointer-events-none z-60 pb-2">
                <div
                    data-manifesto-text
                    className="col-start-3 col-span-14 text-center uppercase text-header leading-[100%] tracking-[-0.045em] font-bold"
                >
                    There is work you take because it pays.
                    <br />
                    <br />
                    There is work you take because it interests you.
                    <br />
                    <br />
                    And then there is the other kind.
                    <br />
                    The kind that keeps you up.
                    <br />
                    <br />
                    That work deserves more.
                    <br />
                    <br />
                    <br />
                    <br />
                    Some work is bigger than any one pair of hands.
                    <br />
                    <br />
                    So independent practices came together,
                    <br />
                    <br />
                    each with its own craft,
                    <br />
                    <br />
                    drawn by the work and by each other,
                    <br />
                    <br />
                    until it could finally be carried the way it deserved.
                    <br />
                    <br />
                    <br />
                    <br />
                    It became a cooperative.
                    <br />
                    <br />
                    One member,
                    <br />
                    one vote.
                    <br />
                    <br />
                    Every voice
                    <br />
                    weighs the same.
                    <br />
                    <br />
                    The work flows to whoever can carry it best.
                    <br />
                    <br />
                    And the credit stays with the work,
                    <br />
                    <br />
                    because how it is built is part of what it stands for.
                    <br />
                    <br />
                    <br />
                    <br />
                    The work is carried long after the launch,
                    <br />
                    <br />
                    when the applause has faded and the making goes on.
                    <br />
                    <br />
                    Devotion outlasts attention.
                    <br />
                    <br />
                    <br />
                    <br />
                    If what you are building matters to the people you serve,
                    <br />
                    <br />
                    there is a place for it here,
                    <br />
                    <br />
                    people who carry it with you and stay.
                </div>
            </div>

            <div className="h-screen min-h-100 pointer-events-none z-0" />

            <div
                data-pillars-section
                className="h-screen flex flex-col justify-end pb-2 z-40 pointer-events-none"
            >
                <div className="grid grid-cols-2 md:grid-cols-18 gap-2">
                    <div
                        data-pillar="welcome"
                        className="col-start-1 col-span-1 md:col-span-4 bg-black text-green uppercase text-justify font-bold text-md h-[35vh] min-h-75 md:h-[70vh] md:min-h-150 leading-[115%] tracking-[-0.04em] p-2 will-change-transform"
                    >
                        Welcome.
                        <br />
                        <br />
                        Open the door to every voice, every story. Honour every
                        heritage, every face.
                    </div>
                    <div
                        data-pillar="craft"
                        className="col-span-1 md:col-span-4 bg-black text-green uppercase text-justify font-bold text-md h-[35vh] min-h-75 md:h-[70vh] md:min-h-150 leading-[115%] tracking-[-0.04em] p-2 will-change-transform"
                    >
                        Craft.
                        <br />
                        <br />
                        Fashion living archives, equal to the desires of the
                        age.
                    </div>
                    <div
                        data-pillar="amplify"
                        className="col-span-1 md:col-span-4 bg-black text-green uppercase text-justify font-bold text-md h-[35vh] min-h-75 md:h-[70vh] md:min-h-150 leading-[115%] tracking-[-0.04em] p-2 will-change-transform"
                    >
                        Amplify.
                        <br />
                        <br />
                        Translate singular dreams and the utopias at the
                        margins. Weave bonds between progress and humanity.
                    </div>
                    <div
                        data-pillar="cultivate"
                        className="col-span-1 md:col-span-4 bg-black text-green uppercase text-justify font-bold text-md h-[35vh] min-h-75 md:h-[70vh] md:min-h-150 leading-[115%] tracking-[-0.04em] p-2 will-change-transform"
                    >
                        Cultivate
                        <br />
                        <br />
                        Act with conviction and ethics, to elevate projects and
                        their missions. Illuminate. Open conversations guided
                        by real needs.
                    </div>
                </div>
            </div>
        </main>
    );
}
