import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import { type MediaItem, type Project } from "@/lib/projects";
import { MuxAutoPlayer } from "@/components/MuxAutoPlayer";
import { LocaleLink } from "@/components/LocaleLink";
import { MemberLink } from "@/components/MemberLink";
import { SanityImage } from "@/components/SanityImage";
import { useT } from "@/lib/SiteContentProvider";

// Lets each media Cell link to its project page without wrapping the whole card
// (so the info header / member names stay independently interactive).
const ProjectHrefContext = createContext<string | null>(null);

function flattenMedia(rows: Project["media"]): MediaItem[] {
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
  const to = useContext(ProjectHrefContext);
  const t = useT();
  if (!item) return null;

  const style = {
    "--cell-sm": sm,
    "--cell-md": span,
    "--cell-start-md": start,
  } as CSSProperties;

  const media = (
    <>
      {item.kind === "video" ? (
        <MuxAutoPlayer
          playbackId={item.muxPlaybackId}
          thumbnail={item.thumbnail}
          className="group-hover:mix-blend-multiply"
        />
      ) : (
        <SanityImage
          src={item.src}
          alt={item.alt ?? ""}
          className="w-full h-auto group-hover:mix-blend-multiply ease-in transition duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs bg-green px-1 pt-0.5">{t("viewProject")}</span>
      </div>
    </>
  );

  const innerClass =
    "relative w-full h-fit overflow-hidden flex items-start justify-start group";

  return (
    <div
      style={style}
      className={`home-cell ${hideOnMobile ? "hidden md:block" : ""} ${className}`}
    >
      {to ? (
        <LocaleLink to={to} className={`${innerClass} block`}>
          {media}
        </LocaleLink>
      ) : (
        <div className={innerClass}>{media}</div>
      )}
    </div>
  );
}

// Per-project preview layouts. Each receives that project's flattened `media`
// (same images as the detail page) and hand-places them however you like inside
// the project's 6-column grid. To restyle a project, edit just its block here.
// Projects without an entry fall back to `defaultLayout`.
const homeLayouts: Record<string, (m: MediaItem[]) => ReactNode> = {
  bxb: (m) => (
    <>
      <Cell item={m[1]} span={6} />

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
      <Cell item={m[7]} span={2} hideOnMobile />
      <Cell item={m[6]} span={2} hideOnMobile />
      <Cell item={m[4]} span={2} hideOnMobile />
    </>
  ),

  ctrl: (m) => (
    <>
      <Cell item={m[6]} span={6} hideOnMobile />
      <Cell item={m[3]} span={3} />
      <Cell item={m[0]} span={3} hideOnMobile />
    </>
  ),

  chimie: (m) => (
    <>
      <Cell item={m[0]} span={4} />
      <Cell item={m[1]} span={2} hideOnMobile />
      <Cell item={m[14]} span={2} hideOnMobile />

      <Cell item={m[15]} span={4} hideOnMobile />
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

// A single project rendered as it appears in the homepage list: a sticky info
// header (client / description / team / services) above the project's media
// layout. Reused on the member page for "Selected work".
export function ProjectPreview({ project }: { project: Project }) {
  // CMS-driven preview takes precedence: render each chosen item at its
  // editor-set width. Falls back to the hardcoded per-project layout (then the
  // default) when no preview media is set in Sanity.
  const preview =
    project.previewMedia && project.previewMedia.length > 0 ? (
      project.previewMedia.map((item, i) => (
        <Cell
          key={i}
          item={item}
          span={item.width}
          hideOnMobile={item.hideOnMobile}
        />
      ))
    ) : (
      (homeLayouts[project.id] ?? defaultLayout)(flattenMedia(project.media))
    );

  return (
    <div data-project className="grid grid-cols-6 gap-2 text-xs">
      <div
        data-sticky-info
        className="grid grid-cols-18 gap-2 col-span-6 sticky top-[calc(var(--nav-height)-0.5em)] h-fit pb-2 pt-2 z-40 bg-white leading-[110%]"
      >
        <div className="col-span-4 md:col-span-4 text-xs leading-[110%]">
          <div>{project.client}</div>
        </div>
        {/* On mobile the team and services columns are hidden, so the
            description fills the remaining grid width; on md+ it returns to its
            4-column slot alongside them. */}
        <div className="col-span-14 md:col-span-4 text-xs leading-[110%]">
          <div>{project.description}</div>
        </div>
        <div className="hidden md:flex col-span-4 flex-col leading-[110%] text-xs">
          {project.team
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean)
            .map((name, i) => (
              <MemberLink key={i} name={name} fill />
            ))}
        </div>
        <div className="hidden md:flex col-span-4 flex-col gap-2 leading-[110%] text-xs">
          {project.services}
        </div>
      </div>
      <ProjectHrefContext.Provider value={`/projects/${project.id}`}>
        {preview}
      </ProjectHrefContext.Provider>
    </div>
  );
}
