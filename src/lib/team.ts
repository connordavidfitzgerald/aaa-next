import { sanity } from "@/lib/sanity";

export interface TeamMember {
  key: string;
  slug: string;
  name: string;
  role: string;
  services: string[];
  location: string;
  image: string;
  bio: string;
  instagram: string;
  linkedin: string;
  memberType: "core" | "collaborator";
  projectIds: string[];
}

// GROQ projection for a teamMember document. `image` resolves to a CDN URL and
// `projectIds` dereferences the `projects` reference array down to each linked
// project's slug — the same id the projects list and member pages key off.
// Nullable fields are coalesced so the UI never has to guard for missing data.
const MEMBER_FIELDS = /* groq */ `
  "key": slug.current,
  "slug": slug.current,
  name,
  role,
  "services": coalesce(services, []),
  location,
  "image": coalesce(image.asset->url, ""),
  "bio": coalesce(bio, ""),
  "instagram": coalesce(instagram, ""),
  "linkedin": coalesce(linkedin, ""),
  memberType,
  "projectIds": coalesce(projects[]->slug.current, [])
`;

// All team members, ordered by creation date (the order they were added in the
// Studio). Split into core/collaborator sections by `memberType` downstream.
export async function getTeamMembers(): Promise<TeamMember[]> {
  return sanity.fetch<TeamMember[]>(
    `*[_type == "teamMember"] | order(_createdAt asc){${MEMBER_FIELDS}}`,
  );
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
  const trimmed = name.trim();
  return members.find((m) => m.name === trimmed)?.slug;
}
