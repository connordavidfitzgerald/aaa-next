import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ViewTransition } from "@/components/ViewTransition";
import { ProjectPreview } from "@/components/ProjectPreview";
import type { Project } from "@/lib/projects";
import teamImg from "@/assets/images/team.jpg";

interface MemberProject {
  id: string;
  client: string;
  image?: string;
  thumbnail?: string;
}

export interface MemberView {
  key: string;
  slug: string;
  name: string;
  role: string;
  services: string[];
  location: string;
  image: string;
  bio: string;
  projects: MemberProject[];
}

interface Section {
  label: string;
  members: MemberView[];
}

export function TeamView({
  sections,
  selected,
  work,
  className = "",
}: {
  sections?: Section[];
  selected?: MemberView;
  work?: Project[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || selected) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const canHover = window.matchMedia("(hover: hover)").matches;
      const rows = root.querySelectorAll<HTMLElement>("[data-team-row]");
      const memberImages = root.querySelectorAll<HTMLElement>(
        '[data-team-image]:not([data-team-image="default"])',
      );
      const highlights = root.querySelectorAll<HTMLElement>("[data-team-hl]");

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
        const hl = row.querySelector<HTMLElement>("[data-team-hl]");
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
              opacity: img.dataset.teamImage === member ? 1 : 0,
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
  }, [sections, selected]);

  // On a member page, hovering a project fades the member portrait out and
  // the matching project thumbnail in (centered, at its natural ratio).
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !selected) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      if (!window.matchMedia("(hover: hover)").matches) return;

      const memberImg = root.querySelector<HTMLElement>(
        '[data-detail-image="member"]',
      );
      const projectImgs = root.querySelectorAll<HTMLElement>(
        '[data-detail-image]:not([data-detail-image="member"])',
      );
      const links = root.querySelectorAll<HTMLElement>("[data-project-hover]");

      links.forEach((link) => {
        const target = root.querySelector<HTMLElement>(
          `[data-detail-image="${link.dataset.projectHover}"]`,
        );
        if (!target) return;

        const fade = (el: Element | null, opacity: number) =>
          gsap.to(el, {
            opacity,
            duration: 0.3,
            ease: "power2.out",
            overwrite: true,
          });

        const handleEnter = () => {
          fade(memberImg, 0);
          projectImgs.forEach((img) => fade(img, img === target ? 1 : 0));
        };
        const handleLeave = () => {
          fade(memberImg, 1);
          fade(target, 0);
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
  }, [selected]);

  const heroMembers = sections?.[0].members ?? [];

  if (selected) {
    return (
      <main
        ref={containerRef}
        className={`flex flex-col px-2 text-xs leading-[120%] ${className}`}
      >
        {/* Image and member info share the first viewport. The image is an
            absolutely-centred layer so it sits in the middle of the viewport
            regardless of the info's height; the info is bottom-anchored via
            justify-end. Selected work sits outside this block. */}
        <div className="relative flex flex-col min-h-screen pt-[var(--nav-height)] pb-2 ">
          {/* The image fills the white space between the navbar and the member
              info: this region grows to take the gap and centers the image in
              it; the info sits below at the bottom. */}
          <div className="grow shrink-0 flex items-center justify-center py-2">
            <div className="grid grid-cols-18 gap-2 w-full">
              <div className="col-span-18 md:col-start-8 md:col-span-4 aspect-square relative -translate-y-1">
                <ViewTransition name="team-hero">
                  <div className="absolute inset-0 w-full h-full ">
                    {selected.image && (
                      <img
                        src={selected.image}
                        alt={selected.name}
                        data-detail-image="member"
                        className="absolute inset-0 w-full h-full object-cover block "
                      />
                    )}
                    {selected.projects.map((p) =>
                      p.image || p.thumbnail ? (
                        <img
                          key={p.id}
                          src={p.image ?? p.thumbnail}
                          alt={p.client}
                          data-detail-image={p.id}
                          className="absolute inset-0 w-full h-full object-contain opacity-0"
                        />
                      ) : null,
                    )}
                  </div>
                </ViewTransition>
              </div>
            </div>
          </div>

          <ViewTransition name="team-list">
            <div className="relative z-10 flex flex-col tracking-[-0.01em] py-2 border-t border-black/20">
              <MemberDetail member={selected} />
            </div>
          </ViewTransition>
        </div>

        {/* Selected work, rendered in the homepage project format. */}
        {work && work.length > 0 && (
          <section className="flex flex-col w-full md:pt-20 ">
            <div className="flex flex-col gap-25 font-normal tracking-[-0.01em] mt-2 border-black/20 border-t pb-2">
              {work.map((project) => (
                <ProjectPreview key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}
      </main>
    );
  }

  return (
    <main
      ref={containerRef}
      className={`relative flex flex-col px-2 text-xs leading-[120%] min-h-screen pt-[var(--nav-height)]  ${className}`}
    >
      {/* The image fills the white space between the navbar and the list: this
          region grows to take the gap and centers the image in it; the list
          sits below. */}
      <div className="grow shrink-0 flex items-center justify-center ">
        <div className="grid grid-cols-18 gap-2 w-full">
          <div className="col-span-18 md:col-start-8 md:col-span-4 aspect-square relative">
            <ViewTransition name="team-hero">
              <div className="absolute inset-0 w-full h-full ">
                <img
                  src={teamImg}
                  alt="team"
                  data-team-image="default"
                  className="absolute inset-0 w-full h-full object-cover block"
                />
                {heroMembers.map((m) => (
                  <img
                    key={m.key}
                    src={m.image}
                    alt={m.name}
                    data-team-image={m.key}
                    className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-0"
                  />
                ))}
              </div>
            </ViewTransition>
          </div>
        </div>
      </div>
      <ViewTransition name="team-list">
        <div className="relative z-10 flex flex-col gap-0 pt-2 tracking-[-0.01em]">
          {sections?.map((section) => (
            <div
              key={section.label}
              className="border-t border-black/20 pt-2 pb-2 flex flex-col gap-2 md:gap-0"
            >
              {/* On mobile the rows stack, so the section label is shown once
                  as a heading instead of in a per-row column. */}
              <p className="md:hidden opacity-70">{section.label}</p>
              {section.members.map((member, i) => (
                <Link
                  key={member.key}
                  to={`/team/${member.slug}`}
                  viewTransition
                  data-team-row
                  data-member={member.key}
                  className="grid grid-cols-12 md:grid-cols-18 gap-x-2 gap-y-0 relative h-fit"
                >
                  <span
                    data-team-hl
                    className="absolute inset-0 bg-green scale-y-0 origin-top hidden md:block"
                  />
                  <p className="hidden md:block md:col-span-2 relative z-10 opacity-70">
                    {i === 0 ? section.label : ""}
                  </p>
                  <p className="col-span-12 md:col-span-4 relative z-10">
                    {member.name}
                  </p>
                  <p className="col-span-12 md:col-span-4 relative z-10">
                    {member.role}
                  </p>
                  <p className="col-span-6 md:col-span-4 relative z-10 ">
                    {member.location}
                  </p>

                  <p className="col-span-6 hidden md:flex md:col-span-4 relative z-10 text-right md:text-left">
                    {member.projects.map((p) => p.client).join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </ViewTransition>
    </main>
  );
}

function MemberDetail({ member }: { member: MemberView }) {
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = detailRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const timelines: Array<{ kill: () => void }> = [];

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      // For each line a green bar grows from the left to cover the text,
      // then retracts to the right, revealing the text in its wake.
      const animateGroup = (selector: string) => {
        gsap.utils.toArray<HTMLElement>(selector, root).forEach((line, i) => {
          const bar = line.querySelector<HTMLElement>("[data-reveal-bar]");
          const text = line.querySelector<HTMLElement>("[data-reveal-text]");
          if (!bar || !text) return;

          gsap.set(text, { opacity: 0 });
          gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

          const tl = gsap.timeline({ delay: 0.3 + i * 0.15 });
          tl.to(bar, { scaleX: 1, duration: 0.4, ease: "power3.out" })
            .set(text, { opacity: 1 })
            .set(bar, { transformOrigin: "right center" })
            .to(bar, {
              scaleX: 0,
              duration: 0.4,
              ease: "power3.out",
            });
          timelines.push(tl);
        });
      };

      // Both groups are kicked off together so services and projects
      // run their staggered reveals at the same time.
      animateGroup("[data-services] [data-reveal-line]");
      animateGroup("[data-projects] [data-reveal-line]");
    })();

    return () => {
      cancelled = true;
      timelines.forEach((tl) => tl.kill());
    };
  }, [member.key]);

  return (
    <div ref={detailRef} className="">
      <div className="grid grid-cols-18 gap-2 md:border-none border-black/20 border-t pt-2 md:pt-0 md:gap-y-8">
        <p className="col-span-12 md:col-span-4">{member.name}</p>
        <p className="col-span-12 md:col-span-4">{member.bio}</p>

        <p className="md:flex hidden md:col-span-4  md:opacity-100">
          {member.location}
        </p>
        <div
          data-services
          className="col-span-4 col-start-13 md:col-span-4  md:opacity-100 flex flex-col items-start"
        >
          {member.services.map((service) => (
            <span
              key={service}
              data-reveal-line
              className="relative overflow-hidden"
            >
              <span data-reveal-text className="inline-block">
                {service}
              </span>
              <span
                data-reveal-bar
                className="absolute inset-0 bg-green origin-left scale-x-0 pointer-events-none"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
