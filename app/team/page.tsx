import { TeamView } from "@/components/TeamView";
import { core, collaborators } from "@/lib/team";
import { projects } from "@/lib/projects";

export const metadata = { title: "Applied Archive Atelier — Team" };

export default function TeamPage() {
    const projectsForMember = (name: string) =>
        projects
            .filter((p) => p.team.includes(name))
            .map((p) => ({ id: p.id, client: p.client }));

    const sections = [
        {
            label: "Core",
            members: core.map((m) => ({
                ...m,
                projects: projectsForMember(m.name),
            })),
        },
        {
            label: "Collaborators",
            members: collaborators.map((m) => ({
                ...m,
                projects: projectsForMember(m.name),
            })),
        },
    ];

    return <TeamView sections={sections} />;
}
