"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { StaticImageData } from "next/image";

import teamImg from "@/assets/images/team.jpg";

interface MemberView {
    key: string;
    slug: string;
    name: string;
    role: string;
    location: string;
    image: StaticImageData;
    projects: string[];
}

interface Section {
    label: string;
    members: MemberView[];
}

export function TeamView({ sections }: { sections: Section[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = containerRef.current;
        if (!root) return;

        let cancelled = false;
        const cleanups: Array<() => void> = [];

        (async () => {
            const { gsap } = await import("gsap");
            if (cancelled) return;

            const canHover = window.matchMedia("(hover: hover)").matches;
            const rows =
                root.querySelectorAll<HTMLElement>("[data-team-row]");
            const memberImages = root.querySelectorAll<HTMLElement>(
                '[data-team-image]:not([data-team-image="default"])',
            );
            const highlights =
                root.querySelectorAll<HTMLElement>("[data-team-hl]");

            const resetAll = () => {
                highlights.forEach((hl) => {
                    gsap.set(hl, {
                        scaleY: 0,
                        transformOrigin: "center top",
                    });
                });
                memberImages.forEach((img) => {
                    gsap.set(img, { opacity: 0 });
                });
            };

            window.addEventListener("pageshow", resetAll);
            window.addEventListener("pagehide", resetAll);
            cleanups.push(() => {
                window.removeEventListener("pageshow", resetAll);
                window.removeEventListener("pagehide", resetAll);
            });

            if (!canHover) return;

            rows.forEach((row) => {
                const hl =
                    row.querySelector<HTMLElement>("[data-team-hl]");
                const member = row.dataset.member;
                if (!hl) return;

                gsap.set(hl, {
                    scaleY: 0,
                    transformOrigin: "center top",
                });

                const handleEnter = () => {
                    gsap.to(hl, {
                        scaleY: 1,
                        transformOrigin: "center top",
                        duration: 0.25,
                        ease: "power3.out",
                        overwrite: true,
                    });
                    memberImages.forEach((img) => {
                        gsap.set(img, {
                            opacity:
                                img.dataset.teamImage === member ? 1 : 0,
                        });
                    });
                };

                const handleLeave = () => {
                    gsap.to(hl, {
                        scaleY: 0,
                        transformOrigin: "center bottom",
                        duration: 0.05,
                        ease: "power3.out",
                        overwrite: true,
                    });
                    memberImages.forEach((img) => {
                        gsap.set(img, { opacity: 0 });
                    });
                };

                const handleClick = () => {
                    gsap.set(hl, {
                        scaleY: 0,
                        transformOrigin: "center top",
                    });
                    memberImages.forEach((img) => {
                        gsap.set(img, { opacity: 0 });
                    });
                };

                row.addEventListener("mouseenter", handleEnter);
                row.addEventListener("mouseleave", handleLeave);
                row.addEventListener("click", handleClick);
                cleanups.push(() => {
                    row.removeEventListener("mouseenter", handleEnter);
                    row.removeEventListener("mouseleave", handleLeave);
                    row.removeEventListener("click", handleClick);
                });
            });
        })();

        return () => {
            cancelled = true;
            cleanups.forEach((fn) => fn());
        };
    }, [sections]);

    const memberImages = sections[0].members;

    return (
        <main
            ref={containerRef}
            className="flex flex-col px-2 text-xs leading-[120%] md:min-h-screen"
        >
            <div className="flex md:flex-1 items-center pt-[calc(var(--nav-height)*1.2)] md:pt-[var(--nav-height)] md:pb-6">
                <div className="grid grid-cols-18 gap-2 w-full">
                    <div className="col-span-12 col-start-4 md:col-start-7 md:col-span-6 aspect-square relative">
                        <Image
                            src={teamImg}
                            alt="team"
                            data-team-image="default"
                            className="absolute inset-0 w-full h-full object-cover block"
                        />
                        {memberImages.map((m) => (
                            <Image
                                key={m.key}
                                src={m.image}
                                alt={m.name}
                                data-team-image={m.key}
                                className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-0"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-0 md:pt-0 pb-4">
                {sections.map((section) => (
                    <div
                        key={section.label}
                        className="border-t border-black/20 pt-2 pb-2"
                    >
                        {section.members.map((member, i) => (
                            <Link
                                key={member.key}
                                href={`/team/${member.slug}`}
                                data-team-row
                                data-member={member.key}
                                className="grid grid-cols-12 md:grid-cols-18 gap-x-2 relative"
                            >
                                <span
                                    data-team-hl
                                    className="absolute inset-0 bg-green scale-y-0 origin-top hidden md:block"
                                />
                                <p className="col-span-12 md:col-span-2 relative z-10 opacity-70">
                                    {i === 0 ? section.label : ""}
                                </p>
                                <p className="col-span-12 md:col-span-4 relative z-10">
                                    {member.name}
                                </p>
                                <p className="col-span-6 md:col-span-4 relative z-10 opacity-70 md:opacity-100">
                                    {member.role}
                                </p>
                                <p className="col-span-6 md:col-span-4 relative z-10 opacity-70 md:opacity-100 text-right md:text-left">
                                    {member.location}
                                </p>
                                <p className="col-span-12 md:col-span-4 relative z-10 flex justify-between gap-2">
                                    <span>{member.projects.join(", ")}</span>
                                    <span>[+]</span>
                                </p>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </main>
    );
}
