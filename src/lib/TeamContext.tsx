import { createContext, useContext, type ReactNode } from "react";

import {
  getTeamMembers,
  findMemberBySlug,
  findSlugByName,
  type TeamMember,
} from "@/lib/team";
import { useQuery } from "@/lib/useQuery";
import { useLocale } from "@/lib/locale";

interface TeamContextValue {
  members: TeamMember[];
  core: TeamMember[];
  collaborators: TeamMember[];
  allies: TeamMember[];
  loading: boolean;
  getMemberBySlug: (slug: string) => TeamMember | undefined;
  memberSlugByName: (name: string) => string | undefined;
}

const TeamContext = createContext<TeamContextValue | null>(null);

// Fetches the team roster from Sanity once and shares it with every page and
// component below. Centralising the fetch keeps the member↔slug lookups (used
// by project credit links) synchronous after the initial load, and avoids each
// consumer issuing its own query.
export function TeamProvider({ children }: { children: ReactNode }) {
  const { lang } = useLocale();
  const { data, loading } = useQuery(() => getTeamMembers(lang), [lang]);
  const members = data ?? [];

  const value: TeamContextValue = {
    members,
    core: members.filter((m) => m.memberType === "core"),
    collaborators: members.filter((m) => m.memberType === "collaborator"),
    allies: members.filter((m) => m.memberType === "ally"),
    loading,
    getMemberBySlug: (slug) => findMemberBySlug(members, slug),
    memberSlugByName: (name) => findSlugByName(members, name),
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam(): TeamContextValue {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within a TeamProvider");
  return ctx;
}
