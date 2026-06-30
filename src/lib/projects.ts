import { sanity } from "@/lib/sanity";
import { loc } from "@/lib/i18n-groq";
import type { Lang } from "@/lib/locale";

export type MediaItem =
  | { kind: "image"; src: string; alt?: string }
  | {
      kind: "video";
      muxPlaybackId: string;
      thumbnail?: string;
      /** Show custom play/scrub/mute/fullscreen controls (else silent autoplay). */
      controls?: boolean;
      /** CSS aspect-ratio (e.g. "319 / 180") for the controlled player's box. */
      aspect?: string;
    };

export type MediaRow = MediaItem | [MediaItem, MediaItem];

// A media item chosen for the homepage preview, plus its layout controls:
// `width` is the desktop column span (out of 6) and `hideOnMobile` drops it on
// small screens.
export type PreviewItem = MediaItem & {
  width: number;
  hideOnMobile: boolean;
};

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectCredit {
  name: string;
  role?: string;
}

export interface Project {
  id: string;
  index: string;
  client: string;
  description: string;
  services: string;
  team: string;
  date: string;
  image?: string;
  imageAlt?: string;
  muxPlaybackId?: string;
  thumbnail?: string;
  media: MediaRow[];
  previewMedia?: PreviewItem[];
  credits?: ProjectCredit[];
  links?: ProjectLink[];
}

// Shared GROQ projection: resolves cover/media images to CDN URLs and flattens
// each media item into the { kind: "image" | "video" } shape the UI expects.
// `media` comes back as rows of `items`; normalizeMedia() collapses 1-item rows
// to a single item and 2-item rows to a tuple (matching MediaRow).
const PROJECT_FIELDS = /* groq */ `
  "id": slug.current,
  index,
  client,
  "description": ${loc("description")},
  "services": ${loc("services")},
  team,
  date,
  "image": image.image.asset->url,
  "imageAlt": ${loc("image.alt")},
  "muxPlaybackId": coalesce(coverVideo.video.asset->playbackId, coverVideo.muxPlaybackId),
  "credits": credits[]{name, "role": ${loc("role")}},
  "links": links[]{"label": ${loc("label")}, href},
  "media": media[]{
    "items": items[]{
      _type == "mediaImage" => {"kind": "image", "src": image.asset->url, "alt": ${loc("alt")}, featured, previewWidth, previewHideOnMobile},
      _type == "mediaVideo" => {"kind": "video", "muxPlaybackId": coalesce(video.asset->playbackId, muxPlaybackId), controls, "aspect": video.asset->data.aspect_ratio, featured, previewWidth, previewHideOnMobile}
    }
  }
`;

// Mux generates poster thumbnails automatically; we derive the URL from the
// playback ID rather than storing one.
const muxThumb = (id: string) => `https://image.mux.com/${id}/thumbnail.jpg`;

// Each media item carries optional homepage-preview controls (set via the
// "Feature in homepage preview" toggle on the item in the Studio).
type PreviewControls = {
  featured: boolean | null;
  previewWidth: number | null;
  previewHideOnMobile: boolean | null;
};

type RawItem = PreviewControls &
  (
    | { kind: "image"; src: string | null; alt: string | null }
    | {
        kind: "video";
        muxPlaybackId: string;
        controls: boolean | null;
        aspect: string | null;
      }
  );

interface RawProject {
  id: string;
  index: string;
  client: string;
  description: string;
  services: string;
  team: string;
  date: string;
  image: string | null;
  imageAlt: string | null;
  muxPlaybackId: string | null;
  credits: { name: string; role: string | null }[] | null;
  links: ProjectLink[] | null;
  media: { items: RawItem[] }[] | null;
}

const toItem = (raw: RawItem): MediaItem =>
  raw.kind === "image"
    ? { kind: "image", src: raw.src ?? "", alt: raw.alt ?? undefined }
    : {
        kind: "video",
        muxPlaybackId: raw.muxPlaybackId,
        controls: raw.controls ?? undefined,
        // Mux reports "W:H"; CSS aspect-ratio wants "W / H".
        aspect: raw.aspect ? raw.aspect.replace(":", " / ") : undefined,
      };

// Homepage preview = the media items flagged "featured", in media order, each
// at its chosen width. No separate upload — the preview reuses the body media.
const buildPreviewMedia = (
  rows: RawProject["media"],
): PreviewItem[] | undefined => {
  const out = (rows ?? [])
    .flatMap((row) => row.items)
    .filter((raw) => raw.featured)
    .filter((raw) => (raw.kind === "image" ? raw.src : raw.muxPlaybackId))
    .map((raw) => ({
      ...toItem(raw),
      width: raw.previewWidth ?? 2,
      hideOnMobile: raw.previewHideOnMobile ?? false,
    }));
  return out.length > 0 ? out : undefined;
};

const normalizeMedia = (rows: RawProject["media"]): MediaRow[] =>
  (rows ?? [])
    .map((row) => row.items.map(toItem))
    .filter((items) => items.length > 0)
    .map((items) =>
      items.length >= 2 ? ([items[0], items[1]] as [MediaItem, MediaItem]) : items[0],
    );

const normalizeProject = (raw: RawProject): Project => ({
  id: raw.id,
  index: raw.index,
  client: raw.client,
  description: raw.description,
  services: raw.services,
  team: raw.team,
  date: raw.date,
  image: raw.image ?? undefined,
  imageAlt: raw.imageAlt ?? undefined,
  muxPlaybackId: raw.muxPlaybackId ?? undefined,
  // Cover-video poster, used as a fallback thumbnail where there's no still
  // image (e.g. the team views). Derived from the Mux playback ID.
  thumbnail: raw.muxPlaybackId ? muxThumb(raw.muxPlaybackId) : undefined,
  credits: raw.credits
    ? raw.credits.map((c) => ({ name: c.name, role: c.role ?? undefined }))
    : undefined,
  links: raw.links ?? undefined,
  media: normalizeMedia(raw.media),
  previewMedia: buildPreviewMedia(raw.media),
});

export async function getProjects(lang: Lang): Promise<Project[]> {
  const raw = await sanity.fetch<RawProject[]>(
    `*[_type == "project"] | order(index asc){${PROJECT_FIELDS}}`,
    { lang },
  );
  return raw.map(normalizeProject);
}

export async function getProject(
  id: string,
  lang: Lang,
): Promise<Project | null> {
  const raw = await sanity.fetch<RawProject | null>(
    `*[_type == "project" && slug.current == $id][0]{${PROJECT_FIELDS}}`,
    { id, lang },
  );
  return raw ? normalizeProject(raw) : null;
}
