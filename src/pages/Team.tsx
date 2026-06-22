import { TeamView } from "@/components/TeamView";
import { getTeam } from "@/lib/team";
import { useQuery } from "@/lib/useQuery";
import { useTitle } from "@/lib/useTitle";

export function TeamPage() {
  useTitle("Applied Archive Atelier — Team");

  const { data } = useQuery(getTeam, []);
  if (!data) return null;

  const sections = [
    { label: "Core", members: data.core },
    { label: "Collaborators", members: data.collaborators },
  ];

  return <TeamView sections={sections} className="" />;
}
