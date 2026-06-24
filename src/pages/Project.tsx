import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { getProject } from "@/lib/projects";
import { useQuery } from "@/lib/useQuery";
import { MediaItem } from "@/components/MediaItem";
import { MemberLink } from "@/components/MemberLink";
import { useTitle } from "@/lib/useTitle";
import { NotFound } from "@/pages/NotFound";

export function ProjectPage() {
  const { project: id } = useParams<{ project: string }>();
  const { data: project, loading } = useQuery(
    useCallback(() => getProject(id ?? ""), [id]),
    [id],
  );

  useTitle(
    project
      ? `Applied Archive Atelier — ${project.client}`
      : "Applied Archive Atelier",
  );

  if (loading) return null;
  if (!project) return <NotFound />;

  return (
    <main className="flex flex-col justify-start px-2 pb-2 w-full h-fit text-xs leading-[115%]">
      <div className="grid grid-cols-18 gap-2 pt-[calc(var(--nav-height)*1.2)]">
        <aside className="col-span-18 md:col-span-4 self-start flex flex-col gap-2 justify-start md:sticky md:top-[calc(var(--nav-height)*1.2)] pb-8 md:pb-0">
          <h1 className="pt-2">{project.client}</h1>
          <div className="flex flex-col gap-2">
            <p>{project.description}</p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <p className="">Credits</p>

            <div className="grid grid-cols-2 " key={project.team}>
              <MemberLink name={project.team} />
              <p className="">{project.services}</p>
            </div>
          </div>

          {project.links && project.links.length > 0 && (
            <div className="flex flex-col gap-2 pt-4">
              <p className="">Links</p>
              <div className="grid md:grid-cols-2 grid-cols-9 gap-2">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    data-nav-link
                    className="relative flex items-center w-fit md:col-span-1 col-span-4"
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
