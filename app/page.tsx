import Image from "next/image";
import Link from "next/link";

import { projects, type MediaItem } from "@/lib/projects";
import { HomeHeroMux } from "@/components/HomeHeroMux";
import { MuxAutoPlayer } from "@/components/MuxAutoPlayer";

const colSpans = [
  "col-span-18 md:col-span-8",
  "hidden md:block md:col-span-5",
  "hidden md:block md:col-span-5",
];

function flattenMedia(rows: (typeof projects)[number]["media"]): MediaItem[] {
  return rows.flatMap((row) => (Array.isArray(row) ? row : [row]));
}

export default function HomePage() {
  return (
    <main className="flex flex-col justify-start px-2 pb-140">
      <section
        id="video"
        className="h-screen flex flex-col justify-end items-center pb-2 min-h-200"
      >
        <HomeHeroMux />
      </section>
      <section
        id="tagline"
        className="w-full aspect-video flex flex-col justify-center items-center"
      >
        <h3 className="text-md bg-green leading-[120%] px-1 pt-0.5 uppercase font-bold tracking-[-0.02em]">
          Some work is worth doing together.
        </h3>
      </section>
      <section
        id="projects"
        className="flex flex-col w-full gap-25 scroll-mt-[calc(var(--nav-height)*1.2)]"
      >
        <div className="flex flex-col gap-25">
          {projects.map((project) => {
            const heroMedia = flattenMedia(project.media).slice(0, 3);
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                id={project.id}
                data-project
                className="grid grid-cols-18 gap-2 text-xs"
              >
                <div className="grid grid-cols-18 gap-2 col-span-18 sticky top-[calc(var(--nav-height)-0.5em)] h-fit pb-1 z-40 bg-white leading-[105%]">
                  <div className="col-span-8 grid-cols-9 grid mt-4">
                    <div className="col-span-6 text-[0.8rem] leading-[110%]">
                      <div>{project.client}</div>
                      <div className="pt-[1em]">{project.description}</div>
                    </div>
                  </div>
                  <div className="col-span-4 mt-4 flex flex-col gap-2">
                    <p className="opacity-70">Services</p>
                    {project.services}
                  </div>
                  <div className="col-span-4 mt-4 flex flex-col gap-2">
                    <p className="opacity-70">Team</p>
                    {project.team}
                  </div>
                  <div className="col-span-2 mt-4 flex flex-col gap-2">
                    <p className="opacity-70">Date</p>
                    {project.date}
                  </div>
                </div>
                {heroMedia.map((item, i) => (
                  <div key={i} className={colSpans[i]}>
                    <div className="relative w-full h-fit overflow-hidden flex items-start justify-start group">
                      {item.kind === "video" ? (
                        <MuxAutoPlayer
                          playbackId={item.muxPlaybackId}
                          thumbnail={item.thumbnail}
                          className="group-hover:mix-blend-multiply"
                        />
                      ) : (
                        <Image
                          src={item.src}
                          alt={item.alt ?? ""}
                          className="w-full h-auto group-hover:mix-blend-multiply ease-in transition duration-500"
                        />
                      )}
                      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <span className="text-xs bg-green px-1 pt-0.5">
                          View Project
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
