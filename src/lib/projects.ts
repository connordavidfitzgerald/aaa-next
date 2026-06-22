import { sanity } from "@/lib/sanity";

export type MediaItem =
  | { kind: "image"; src: string; alt?: string }
  | { kind: "video"; muxPlaybackId: string; thumbnail?: string };

export type MediaRow = MediaItem | [MediaItem, MediaItem];

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
  description,
  services,
  team,
  date,
  "image": image.image.asset->url,
  "imageAlt": image.alt,
  "muxPlaybackId": coverVideo.muxPlaybackId,
  "thumbnail": coverVideo.thumbnail,
  "credits": credits[]{name, role},
  "links": links[]{label, href},
  "media": media[]{
    "items": items[]{
      _type == "mediaImage" => {"kind": "image", "src": image.asset->url, "alt": alt},
      _type == "mediaVideo" => {"kind": "video", "muxPlaybackId": muxPlaybackId, "thumbnail": thumbnail}
    }
  }
`;

type RawItem =
  | { kind: "image"; src: string | null; alt: string | null }
  | { kind: "video"; muxPlaybackId: string; thumbnail: string | null };

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
  thumbnail: string | null;
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
        thumbnail: raw.thumbnail ?? undefined,
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
  thumbnail: raw.thumbnail ?? undefined,
  credits: raw.credits
    ? raw.credits.map((c) => ({ name: c.name, role: c.role ?? undefined }))
    : undefined,
  links: raw.links ?? undefined,
  media: normalizeMedia(raw.media),
});

export async function getProjects(): Promise<Project[]> {
  const raw = await sanity.fetch<RawProject[]>(
    `*[_type == "project"] | order(index asc){${PROJECT_FIELDS}}`,
  );
  return raw.map(normalizeProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const raw = await sanity.fetch<RawProject | null>(
    `*[_type == "project" && slug.current == $id][0]{${PROJECT_FIELDS}}`,
    { id },
  );
  return raw ? normalizeProject(raw) : null;
}
