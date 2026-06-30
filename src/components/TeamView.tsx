import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ViewTransition } from "@/components/ViewTransition";
import { ProjectPreview } from "@/components/ProjectPreview";
import { TeamVideoPlayer } from "@/components/TeamVideoPlayer";
import { LocaleLink } from "@/components/LocaleLink";
import { SanityImage } from "@/components/SanityImage";
import { useLocale } from "@/lib/locale";
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
  /** Mux playback ID, when the member has an uploaded video. */
  videoPlaybackId?: string;
  /** Caption shown beside the member video. */
  videoCaption?: string;
  /** Video aspect ratio as a CSS value (e.g. "4 / 3"). */
  videoAspect?: string;
  bio: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
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
  outro,
  careersEmail,
  className = "",
}: {
  sections?: Section[];
  selected?: MemberView;
  work?: Project[];
  /** Closing invitation shown beneath the member sections (team list only). */
  outro?: string;
  careersEmail?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { localizedPath } = useLocale();
  // The slug of the member currently highlighted by the mobile scroll-spy, so
  // tapping the sticky picture can jump straight to that member's page.
  const activeSlugRef = useRef<string | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || selected) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const rows = root.querySelectorAll<HTMLElement>("[data-team-row]");
      const stickyEl = root.querySelector<HTMLElement>("[data-team-sticky]");
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
      const isMobileLayout = window.matchMedia("(max-width: 767px)").matches;

      if (isMobileLayout) {
        const activateMember = (memberKey: string | null) => {
          rows.forEach((row) => {
            const hl = row.querySelector<HTMLElement>("[data-team-hl]");
            const active = row.dataset.member === memberKey;

            if (!hl) return;

            gsap.to(hl, {
              scaleY: active ? 1 : 0,
              duration: 0.2,
              ease: "power3.out",
              overwrite: true,
            });
          });

          memberImages.forEach((img) => {
            gsap.set(img, {
              opacity: img.dataset.teamImage === memberKey ? 1 : 0,
            });
          });
        };

        const updateClosest = () => {
          // The sticky image covers the top of the viewport with a white
          // square whose height varies with the screen width. Measuring the
          // detection point against the whole viewport can land it *behind*
          // that square, hiding the highlighted name. Instead, target the
          // visible band of the list that sits below the sticky image, so the
          // active name is always in clear view regardless of screen size.
          const stickyRect = stickyEl?.getBoundingClientRect();
          const bandTop = stickyRect ? stickyRect.bottom : 0;
          const bandBottom = window.innerHeight;
          // ~40% into the visible band reads as comfortably "near the top of
          // what's visible" without hugging the image's edge.
          const detectionPoint = bandTop + (bandBottom - bandTop) * 0.1;

          let closestMember: string | null = null;
          let closestSlug: string | null = null;
          let closestDistance = Infinity;

          rows.forEach((row) => {
            const rect = row.getBoundingClientRect();
            const rowCenter = rect.top + rect.height / 2;
            const distance = Math.abs(rowCenter - detectionPoint);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestMember = row.dataset.member ?? null;
              closestSlug = row.dataset.slug ?? null;
            }
          });

          activeSlugRef.current = closestSlug;
          activateMember(closestMember);
        };

        updateClosest();

        let raf = 0;

        const handleScroll = () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(updateClosest);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        cleanups.push(() => {
          cancelAnimationFrame(raf);
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", handleScroll);
        });

        return;
      }

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

  if (selected) {
    return (
      <main
        ref={containerRef}
        className={`flex flex-col px-2 text-xs leading-[120%] ${className} pb-2`}
      >
        {/* Image and member info share the first viewport. The image is an
            absolutely-centred layer so it sits in the middle of the viewport
            regardless of the info's height; the info is bottom-anchored via
            justify-end. Selected work sits outside this block. */}
        <div className="relative flex flex-col min-h-screen pt-[var(--nav-height)] md:pb-2 ">
          {/* The image fills the white space between the navbar and the member
              info: this region grows to take the gap and centers the image in
              it; the info sits below at the bottom. */}
          <div className="grow shrink-0 flex items-center justify-center py-2">
            <div className="grid grid-cols-18 gap-2 w-full">
              <div className="col-span-18 md:col-start-8 md:col-span-4 aspect-square relative -translate-y-1 ">
                <ViewTransition name="team-hero">
                  <div className="absolute inset-0 w-full h-full ">
                    {selected.image && (
                      <SanityImage
                        src={selected.image}
                        alt={selected.name}
                        data-detail-image="member"
                        sizes="(max-width: 768px) 60vw, 25vw"
                        eager
                        className="absolute inset-0 w-full h-full object-cover block "
                      />
                    )}
                    {selected.projects.map((p) =>
                      p.image || p.thumbnail ? (
                        <SanityImage
                          key={p.id}
                          src={(p.image ?? p.thumbnail)!}
                          alt={p.client}
                          data-detail-image={p.id}
                          sizes="(max-width: 768px) 60vw, 25vw"
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

        {/* Optional member video: full width within the page gutter, sitting
            just below the member info. */}
        {selected.videoPlaybackId && (
          <div className="grid grid-cols-9 gap-2 border-t border-black/20 md:border-none py-2 md:py-0">
            <div className="md:col-span-2 col-span-9">
              {selected.videoCaption}
            </div>
            <div className="md:col-span-7 md:col-start-3 col-span-9 w-full ">
              <TeamVideoPlayer
                playbackId={selected.videoPlaybackId}
                aspectRatio={selected.videoAspect}
              />
            </div>
          </div>
        )}

        {/* Selected work, rendered in the homepage project format. */}
        {work && work.length > 0 && (
          <section className="flex flex-col w-full md:pt-20 ">
            <div className="flex flex-col gap-25 font-normal tracking-[-0.01em] md:mt-2 border-black/20 border-t md:pb-2">
              {work.map((project) => (
                <ProjectPreview key={project.id} project={project} />
              ))}
            </div>
            <div className="h-50 flex md:hidden"></div>
          </section>
        )}
      </main>
    );
  }

  const allMembers = sections?.flatMap((section) => section.members) ?? [];

  return (
    <main
      ref={containerRef}
      className={`relative flex flex-col px-2 text-xs leading-[120%] pt-[calc(var(--nav-height))] md:pt-0 ${className}`}
    >
      {/* Sticky image + member lists share this wrapper, so the centred image
          un-sticks at the end of the lists instead of overlaying the closing
          section below it. */}
      <div className="relative">
        {/* The team image is fixed in the viewport centre and layered above the
          list. It defaults to the team photo; hovering a name swaps in that
          member's portrait (toggled in the hover effect above). It is
          pointer-events-none so the names underneath stay hoverable. */}
        <div
          data-team-sticky
          className="sticky h-auto w-full aspect-square md:aspect-auto md:h-screen md:top-0 top-[calc(var(--nav-height))] w-full z-20 flex items-center justify-center px-2  pointer-events-none bg-white md:bg-transparent"
        >
          <div className="grid grid-cols-18 gap-2 w-full">
            {/* The picture re-enables pointer events on mobile only (the sticky
              wrapper is pointer-events-none so names stay tappable): tapping it
              jumps to whichever member the scroll-spy currently highlights. On
              desktop it stays click-through so hovering names drives the swap. */}
            <div
              onClick={() => {
                if (activeSlugRef.current)
                  navigate(localizedPath(`/team/${activeSlugRef.current}`));
              }}
              className="col-start-5 col-span-10 md:col-start-8 md:col-span-4 aspect-square relative pointer-events-auto md:pointer-events-none cursor-pointer"
            >
              <ViewTransition name="team-hero">
                <img
                  src={teamImg}
                  alt="team"
                  data-team-image="default"
                  className="absolute inset-0 w-full h-full object-cover block"
                />
              </ViewTransition>
              {allMembers.map((member) =>
                member.image ? (
                  <SanityImage
                    key={member.key}
                    src={member.image}
                    alt={member.name}
                    data-team-image={member.key}
                    sizes="(max-width: 768px) 60vw, 25vw"
                    className="absolute inset-0 w-full h-full object-cover block opacity-0"
                  />
                ) : null,
              )}
            </div>
          </div>
        </div>

        {/* The team list. Each section's label sits above its rows. Rows are a
          9-column grid: the name spans columns 1–6, with role and location
          sharing columns 7–9, justified to opposite edges. */}
        <ViewTransition name="team-list">
          <div className="md:-mt-40 relative z-10 flex flex-col tracking-[-0.01em] pb-2 gap-10">
            {sections?.map((section) => (
              <div key={section.label} className="flex flex-col pt-8">
                <p className="opacity-70 md:pb-2 pb-0.5 border-b border-black/20">
                  {section.label}
                </p>
                {section.members.map((member) => {
                  const roles = member.role
                    .split(",")
                    .map((r) => r.trim())
                    .filter(Boolean);
                  return (
                    <LocaleLink
                      key={member.key}
                      to={`/team/${member.slug}`}
                      data-team-row
                      data-member={member.key}
                      data-slug={member.slug}
                      className="relative grid grid-cols-9 gap-x-2 items-center  border-b border-black/20 md:py-2 py-0.5"
                    >
                      <span
                        data-team-hl
                        className="absolute inset-0 bg-green scale-y-0 origin-top"
                      />
                      <p className="col-span-6 relative z-10 text-xs md:text-lg leading-none pt-1">
                        {member.name}
                      </p>
                      <div className="col-span-3 relative z-10 flex justify-between items-center gap-x-2">
                        <div className="flex flex-col">
                          {roles.map((role) => (
                            <span className="md:flex hidden" key={role}>
                              {role}
                            </span>
                          ))}
                        </div>
                        <p className="pr-1">{member.location}</p>
                      </div>
                    </LocaleLink>
                  );
                })}
              </div>
            ))}
          </div>
        </ViewTransition>

        {/* Closing invitation lives INSIDE the sticky wrapper and is a full
            viewport tall. Because it's the wrapper's last child, the centred
            image stays fixed until it reaches the middle of this section, then
            scrolls away together with it. The text sits in the lower half,
            beneath where the image lands. */}
        {outro && (
          <section className="relative z-10 h-screen grid grid-cols-9 items-end gap-2 pb-2">
            <p className="text-lg leading-[105%] tracking-[-0.02em] col-span-5">
              {outro}
            </p>
            {careersEmail && (
              <a
                href={`mailto:${careersEmail}`}
                data-nav-link
                className="relative flex flex-row items-end w-full text-xs col-span-4 justify-end"
              >
                <span
                  data-nav-hl
                  className="absolute inset-0 bg-green scale-y-0 origin-top"
                />
                <span className="relative z-10">
                  {careersEmail} <span className="text-[10px]">↗</span>
                </span>
              </a>
            )}
          </section>
        )}
      </div>
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
      <div className="grid grid-cols-18 gap-2 md:gap-y-8">
        <p className="col-span-18 md:col-span-4">{member.name}</p>
        <p className="col-span-12 md:col-span-4">{member.bio}</p>

        <p className="md:flex hidden md:col-span-4  md:opacity-100">
          {member.location}
        </p>
        <div
          data-services
          className="col-span-6 md:col-span-4  md:opacity-100 flex flex-col items-start"
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

        {/* Member's links, stacked in the last two columns and right-aligned.
            Each link only renders when its field is filled in. */}
        {(member.instagram || member.linkedin || member.email) && (
          <div className="col-span-8 md:col-span-2 md:col-start-17 grid grid-cols-2 md:flex md:flex-col gap-2 md:gap-0 md:items-end items-start md:text-right text-left ">
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-fit"
              >
                Instagram <span className="text-[10px]">↗</span>
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-fit"
              >
                LinkedIn <span className="text-[10px] align-baseline">↗</span>
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="w-fit">
                Email <span className="text-[10px] align-baseline">↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
