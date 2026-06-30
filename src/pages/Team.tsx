import { TeamView } from "@/components/TeamView";
import { type TeamMember } from "@/lib/team";
import { useTeam } from "@/lib/TeamContext";
import { getProjects, type Project } from "@/lib/projects";
import { useQuery } from "@/lib/useQuery";
import { useTitle } from "@/lib/useTitle";
import { useLocale } from "@/lib/locale";
import { useSiteContent, useT } from "@/lib/SiteContentProvider";

export function TeamPage() {
  const { lang } = useLocale();
  const { content } = useSiteContent();
  const t = useT();
  useTitle(`Applied Archive Atelier — ${t("titleTeam")}`);

  const { core, collaborators, allies } = useTeam();
  const { data: projects } = useQuery(() => getProjects(lang), [lang]);
  const allProjects = projects ?? [];

  // Resolve each member's projectIds into the project previews TeamView wants.
  const withProjects = (m: TeamMember) => ({
    ...m,
    projects: m.projectIds
      .map((id) => allProjects.find((p) => p.id === id))
      .filter((p): p is Project => p !== undefined)
      .map((p) => ({
        id: p.id,
        client: p.client,
        image: p.image,
        thumbnail: p.thumbnail,
      })),
  });

  // Sort each section alphabetically by name (locale-aware so accented names
  // like "Hazoumé" sort naturally).
  const byName = (a: TeamMember, b: TeamMember) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

  const sections = [
    { label: t("teamCore"), members: [...core].sort(byName).map(withProjects) },
    {
      label: t("teamCollaborators"),
      members: [...collaborators].sort(byName).map(withProjects),
    },
    {
      label: t("teamAllies"),
      members: [...allies].sort(byName).map(withProjects),
    },
  ].filter((section) => section.members.length > 0);

  return (
    <TeamView
      sections={sections}
      outro={content?.team.outro}
      careersEmail={content?.team.careersEmail}
      ctaLabel={content?.team.ctaLabel}
      className="min-h-200"
    />
  );
}
