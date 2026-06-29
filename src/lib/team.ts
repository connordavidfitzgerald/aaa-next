import { sanity } from "@/lib/sanity";
import { loc } from "@/lib/i18n-groq";
import type { Lang } from "@/lib/locale";

export interface TeamMember {
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
  /** Video aspect ratio as a CSS value (e.g. "4 / 3"), so the player reserves
   *  the right box before metadata loads. */
  videoAspect?: string;
  bio: string;
  instagram: string;
  linkedin: string;
  email: string;
  memberType: "core" | "collaborator" | "ally";
  projectIds: string[];
}

interface RawTeamMember extends Omit<TeamMember, "services" | "videoAspect"> {
  services: string | null;
  videoAspect: string | null;
}

// GROQ projection for a teamMember document. `image` resolves to a CDN URL and
// `projectIds` dereferences the `projects` reference array down to each linked
// project's slug — the same id the projects list and member pages key off.
// Nullable fields are coalesced so the UI never has to guard for missing data.
const MEMBER_FIELDS = /* groq */ `
  "key": slug.current,
  "slug": slug.current,
  name,
  "role": coalesce(${loc("role")}, ""),
  "services": ${loc("services")},
  "location": coalesce(${loc("location")}, ""),
  "image": coalesce(image.asset->url, ""),
  "videoPlaybackId": video.asset->playbackId,
  "videoCaption": ${loc("videoCaption")},
  "videoAspect": video.asset->data.aspect_ratio,
  "bio": coalesce(${loc("bio")}, ""),
  "instagram": coalesce(instagram, ""),
  "linkedin": coalesce(linkedin, ""),
  "email": coalesce(email, ""),
  memberType,
  "projectIds": coalesce(projects[]->slug.current, [])
`;

// Services come back as a localized comma-separated string; the UI wants a list.
const splitServices = (s: string | null): string[] =>
  (s ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

// All team members, ordered by creation date (the order they were added in the
// Studio). Split into core/collaborator sections by `memberType` downstream.
export async function getTeamMembers(lang: Lang): Promise<TeamMember[]> {
  const raw = await sanity.fetch<RawTeamMember[]>(
    `*[_type == "teamMember"] | order(_createdAt asc){${MEMBER_FIELDS}}`,
    { lang },
  );
  return raw.map((m) => ({
    ...m,
    services: splitServices(m.services),
    // Mux reports "W:H"; CSS aspect-ratio wants "W / H".
    videoAspect: m.videoAspect ? m.videoAspect.replace(":", " / ") : undefined,
  }));
}

// Pure lookups over an already-loaded member list. The TeamProvider binds these
// to its fetched data so components can resolve members synchronously on render.
export function findMemberBySlug(
  members: TeamMember[],
  slug: string,
): TeamMember | undefined {
  return members.find((m) => m.slug === slug);
}

// Resolve a display name (e.g. a project's credit entry) to a member slug, or
// undefined when the name isn't one of our members (external collaborators).
export function findSlugByName(
  members: TeamMember[],
  name: string,
): string | undefined {
  // Match leniently (case- and whitespace-insensitive) so a credit's name
  // links to the member even when the casing/spacing differs slightly from
  // the roster entry.
  const normalize = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
  const target = normalize(name);
  return members.find((m) => normalize(m.name) === target)?.slug;
}
