import { useMemo } from "react";

import { getProjects, type Project } from "@/lib/projects";
import { useQuery } from "@/lib/useQuery";
import { useLocale } from "@/lib/locale";
import { useSiteContent } from "@/lib/SiteContentProvider";
import { HomeHeroMux } from "@/components/HomeHeroMux";
import { LocaleLink } from "@/components/LocaleLink";
import { ProjectPreview } from "@/components/ProjectPreview";
import { CursorImageTrail } from "@/components/CursorImageTrail";

// Collect each project's usable still images (cover first, then media stills),
// capped per project, then round-robin interleave them so a sequential walk
// through the list alternates between projects.
function trailImagesFrom(projects: Project[]): string[] {
  const PER_PROJECT = 4;
  const perProject = projects
    .map((p) => {
      const imgs: string[] = [];
      if (p.image) imgs.push(p.image);
      else if (p.thumbnail) imgs.push(p.thumbnail);
      for (const row of p.media) {
        for (const item of Array.isArray(row) ? row : [row]) {
          if (item.kind === "image" && item.src) imgs.push(item.src);
          else if (item.kind === "video" && item.thumbnail)
            imgs.push(item.thumbnail);
        }
      }
      return imgs.slice(0, PER_PROJECT);
    })
    .filter((imgs) => imgs.length > 0);

  const out: string[] = [];
  const max = perProject.reduce((m, a) => Math.max(m, a.length), 0);
  for (let i = 0; i < max; i++) {
    for (const imgs of perProject) {
      if (i < imgs.length) out.push(imgs[i]);
    }
  }
  return out;
}

export function HomePage() {
  const { lang } = useLocale();
  const { content } = useSiteContent();
  const { data: projects } = useQuery(() => getProjects(lang), [lang]);

  const trailImages = useMemo(
    () => trailImagesFrom(projects ?? []),
    [projects],
  );

  return (
    <main className="flex flex-col justify-start px-2 pb-2">
      <section
        id="video"
        className="h-screen flex flex-col justify-end items-center pb-2 md:min-h-200"
      >
        <HomeHeroMux />
      </section>
      <CursorImageTrail
        id="tagline"
        images={trailImages}
        className="w-full h-screen"
      >
        <h3 className="text-lg uppercase font-bold tracking-[-0.02em] leading-[95%]  grid grid-cols-9 ">
          <span className="col-span-5 col-start-3 text-center">
            <span
              className="box-decoration-clone w-fit px-0.5 text-black
              bg-[linear-gradient(var(--color-green),var(--color-green))]
              bg-size-[100%_80%] bg-no-repeat bg-center align-middle pt-0.5"
            >
              {content?.home.tagline}
            </span>
          </span>
        </h3>
        <LocaleLink
          to="/about"
          data-nav-link
          className="relative flex items-center w-fit cursor-pointer text-xs tracking-[-0.01em]"
        >
          <span
            data-nav-hl
            className="absolute inset-0 bg-green scale-y-0 origin-top -mx-0.5 -mt-0.5 "
          />
          <span className="relative z-10">
            {content?.home.manifestoLinkLabel}{" "}
            <span className="text-[10px]">↗</span>
          </span>
        </LocaleLink>
      </CursorImageTrail>
      <section
        id="projects"
        className="flex flex-col w-full gap-25 scroll-mt-[calc(var(--nav-height)*1.2)]"
      >
        <div className="flex flex-col gap-25 font-normal tracking-[-0.01em]">
          {(projects ?? []).map((project) => (
            <ProjectPreview key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
