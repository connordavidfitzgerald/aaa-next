import { useParams } from "react-router-dom";

import { TeamView } from "@/components/TeamView";
import { core } from "@/lib/team";
import { getProjects, type Project } from "@/lib/projects";
import { useQuery } from "@/lib/useQuery";
import { useTitle } from "@/lib/useTitle";
import { NotFound } from "@/pages/NotFound";

export function MemberPage() {
    const { member: slug } = useParams<{ member: string }>();
    const member = core.find((m) => m.slug === slug);
    const { data: projects } = useQuery(getProjects, []);

    useTitle(
        member
            ? `Applied Archive Atelier — ${member.name}`
            : "Applied Archive Atelier",
    );

    if (!member) return <NotFound />;

    // Full project records for this member's work, in the member's own order.
    const allProjects = projects ?? [];
    const work: Project[] = member.projectIds
        .map((id) => allProjects.find((p) => p.id === id))
        .filter((p): p is Project => p !== undefined);

    const selected = {
        ...member,
        projects: work.map((p) => ({
            id: p.id,
            client: p.client,
            image: p.image,
            thumbnail: p.thumbnail,
        })),
    };

    return <TeamView selected={selected} work={work} />;
}
