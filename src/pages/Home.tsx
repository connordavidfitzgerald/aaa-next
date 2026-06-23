import { useMemo } from "react";
import { Link } from "react-router-dom";

import { getProjects, type Project } from "@/lib/projects";
import { useQuery } from "@/lib/useQuery";
import { HomeHeroMux } from "@/components/HomeHeroMux";
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
  const { data: projects } = useQuery(getProjects, []);

  const trailImages = useMemo(
    () => trailImagesFrom(projects ?? []),
    [projects],
  );

  return (
    <main className="flex flex-col justify-start px-2 pb-2">
      <section
        id="video"
        className="h-screen flex flex-col justify-end items-center pb-2 min-h-200"
      >
        <HomeHeroMux />
      </section>
      <CursorImageTrail
        id="tagline"
        images={trailImages}
        className="w-full aspect-video"
      >
        <h3 className="text-md uppercase font-bold tracking-[-0.02em] leading-[105%] grid grid-cols-9 gap-2">
          <span className="col-span-5 col-start-3 text-center">
            <span className="bg-green box-decoration-clone px-1 pt-0.5 text-black">
              Applied Archive Atelier is a creative studio amplifying
              exclusively non-profits, cultural institutions and social
              businesses.
            </span>
          </span>
        </h3>
        <Link
          to="/manifesto"
          data-nav-link
          className="relative flex items-center w-fit cursor-pointer text-xs tracking-[-0.01em]"
        >
          <span
            data-nav-hl
            className="absolute inset-0 bg-green scale-y-0 origin-top -mx-0.5 -mt-0.5 "
          />
          <span className="relative z-10">
            Read more about our stance. <span className="text-[10px]">↗</span>
          </span>
        </Link>
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
