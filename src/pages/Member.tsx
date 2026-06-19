import { useParams } from "react-router-dom";

import { TeamView } from "@/components/TeamView";
import { core } from "@/lib/team";
import { projects } from "@/lib/projects";
import { useTitle } from "@/lib/useTitle";
import { NotFound } from "@/pages/NotFound";

export function MemberPage() {
    const { member: slug } = useParams<{ member: string }>();
    const member = core.find((m) => m.slug === slug);

    useTitle(
        member
            ? `Applied Archive Atelier — ${member.name}`
            : "Applied Archive Atelier",
    );

    if (!member) return <NotFound />;

    const memberProjects = projects
        .filter((p) => p.team.includes(member.name))
        .map((p) => ({
            id: p.id,
            client: p.client,
            image: p.image,
            thumbnail: p.thumbnail,
        }));

    return <TeamView selected={{ ...member, projects: memberProjects }} />;
}
