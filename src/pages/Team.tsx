import { TeamView } from "@/components/TeamView";
import { type TeamMember } from "@/lib/team";
import { useTeam } from "@/lib/TeamContext";
import { getProjects, type Project } from "@/lib/projects";
import { useQuery } from "@/lib/useQuery";
import { useTitle } from "@/lib/useTitle";

export function TeamPage() {
  useTitle("Applied Archive Atelier — Team");

  const { core, collaborators } = useTeam();
  const { data: projects } = useQuery(getProjects, []);
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

  const sections = [
    { label: "Core", members: core.map(withProjects) },
    { label: "Collaborators", members: collaborators.map(withProjects) },
  ];

  return <TeamView sections={sections} className="min-h-200" />;
}
