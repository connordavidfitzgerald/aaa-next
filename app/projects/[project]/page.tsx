import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { projects } from "@/lib/projects";
import { MediaItem } from "@/components/MediaItem";

export function generateStaticParams() {
  return projects.map((p) => ({ project: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ project: string }>;
}): Promise<Metadata> {
  const { project: id } = await params;
  const project = projects.find((p) => p.id === id);
  return {
    title: project
      ? `Applied Archive Atelier — ${project.client}`
      : "Applied Archive Atelier",
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project: id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <main className="flex flex-col justify-start px-2 pb-2 w-full h-fit text-xs leading-[115%]">
      <div className="grid grid-cols-18 gap-2 pt-[calc(var(--nav-height)*1.2)]">
        <aside className="col-span-10 md:col-span-4 self-start flex flex-col gap-2 justify-start md:sticky md:top-[calc(var(--nav-height)*1.2)] pb-8 md:pb-0">
          <h1 className="">{project.client}</h1>
          <p className="opacity-70 pt-2">Project Info</p>
          <div className="flex flex-col gap-2">
            <p>{project.description}</p>
          </div>

          {project.credits && project.credits.length > 0 && (
            <div className="flex flex-col gap-2 pt-4">
              <p className="opacity-70">Credits</p>
              {project.credits.map((credit) => (
                <p key={credit}>{credit}</p>
              ))}
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <div className="flex flex-col gap-2 pt-4">
              <p className="opacity-70">Links</p>
              <div className="grid grid-cols-2 gap-2">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    data-nav-link
                    className="relative flex items-center w-fit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      data-nav-hl
                      className="absolute inset-0 bg-green scale-y-0 origin-top"
                    />
                    <span className="relative z-10">
                      {link.label} <span className="text-[10px]">↗</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="col-span-18 md:col-span-14 h-fit flex flex-col justify-start gap-2">
          {project.media.map((row, i) =>
            Array.isArray(row) ? (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <MediaItem item={row[0]} />
                <MediaItem item={row[1]} />
              </div>
            ) : (
              <MediaItem key={i} item={row} />
            ),
          )}
        </div>
      </div>
    </main>
  );
}
