import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import bxb from "@/assets/images/bxb.jpg";
import { projects, img, type MediaItem } from "@/lib/projects";
import { HomeHeroMux } from "@/components/HomeHeroMux";
import { MuxAutoPlayer } from "@/components/MuxAutoPlayer";

function flattenMedia(rows: (typeof projects)[number]["media"]): MediaItem[] {
  return rows.flatMap((row) => (Array.isArray(row) ? row : [row]));
}

// One image/video in a project's homepage preview. `span` is the desktop
// column width (out of 6); `sm` overrides the mobile width (default full);
// `start` optionally pins the desktop start column. `hideOnMobile` drops it on
// small screens. Pass `className` for anything else (margins, row offsets…).
function Cell({
  item,
  span,
  sm,
  start,
  hideOnMobile = false,
  className = "",
}: {
  item?: MediaItem;
  span?: number;
  sm?: number;
  start?: number;
  hideOnMobile?: boolean;
  className?: string;
}) {
  if (!item) return null;

  const style = {
    "--cell-sm": sm,
    "--cell-md": span,
    "--cell-start-md": start,
  } as CSSProperties;

  return (
    <div
      style={style}
      className={`home-cell ${hideOnMobile ? "hidden md:block" : ""} ${className}`}
    >
      <div className="relative w-full h-fit overflow-hidden flex items-start justify-start group">
        {item.kind === "video" ? (
          <MuxAutoPlayer
            playbackId={item.muxPlaybackId}
            thumbnail={item.thumbnail}
            className="group-hover:mix-blend-multiply"
          />
        ) : (
          <img
            src={item.src}
            alt={item.alt ?? ""}
            className="w-full h-auto group-hover:mix-blend-multiply ease-in transition duration-500"
          />
        )}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="text-xs bg-green px-1 pt-0.5">View Project</span>
        </div>
      </div>
    </div>
  );
}

// Per-project homepage layouts. Each receives that project's flattened `media`
// (same images as the detail page) and hand-places them however you like inside
// the project's 6-column grid. To restyle a project, edit just its block here.
// Projects without an entry fall back to `defaultLayout`.
const homeLayouts: Record<string, (m: MediaItem[]) => ReactNode> = {
  bxb: (m) => (
    <>
      <Cell item={img(bxb, "Brique par brique")} span={3} hideOnMobile />
      <Cell item={m[1]} span={3} />
      <Cell item={m[0]} span={4} hideOnMobile />
      <Cell item={m[4]} span={2} hideOnMobile />
    </>
  ),

  ellipse: (m) => (
    <>
      <Cell item={m[0]} span={4} />
      <Cell item={m[1]} span={2} hideOnMobile />
      <Cell item={m[3]} span={2} hideOnMobile />
      <Cell item={m[2]} span={4} hideOnMobile />
    </>
  ),

  ecozoic: (m) => (
    <>
      <Cell item={m[0]} span={6} />
      <Cell item={m[1]} span={3} hideOnMobile />
      <Cell item={m[3]} span={3} hideOnMobile />
      <Cell item={m[4]} span={6} hideOnMobile />
    </>
  ),

  ctrl: (m) => (
    <>
      <Cell item={m[4]} span={3} />
      <Cell item={m[0]} span={3} hideOnMobile />
      <Cell item={m[3]} span={2} hideOnMobile />

      <Cell item={m[6]} span={4} hideOnMobile />
    </>
  ),

  chimie: (m) => (
    <>
      <Cell item={m[0]} span={4} />
      <Cell item={m[1]} span={2} hideOnMobile />
      <Cell item={m[3]} span={3} hideOnMobile />

      <Cell item={m[4]} span={3} hideOnMobile />
    </>
  ),
};

const defaultLayout = (m: MediaItem[]) => (
  <>
    <Cell item={m[0]} span={2} />
    <Cell item={m[1]} span={2} hideOnMobile />
    <Cell item={m[2]} span={2} hideOnMobile />
  </>
);

export function HomePage() {
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
            const layout = homeLayouts[project.id] ?? defaultLayout;
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                id={project.id}
                data-project
                className="grid grid-cols-6 gap-2 text-xs"
              >
                <div className="grid grid-cols-18 gap-2 col-span-6 sticky top-[calc(var(--nav-height)-0.5em)] h-fit pb-2 z-40 bg-white leading-[105%]">
                  <div className="col-span-8 grid-cols-8 gap-2 grid mt-2">
                    <div className="col-span-4 text-xs leading-[110%]">
                      <div>{project.client}</div>
                    </div>
                    <div className="col-span-4 text-xs leading-[110%]">
                      <div>{project.description}</div>
                    </div>
                  </div>
                  <div className="col-span-4 mt-2 flex flex-col gap-2 leading-[100%] text-xs">
                    {project.team}
                  </div>
                  <div className="col-span-4 mt-2 flex flex-col gap-2 leading-[100%] text-xs">
                    {project.services}
                  </div>
                </div>
                {layout(flattenMedia(project.media))}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
