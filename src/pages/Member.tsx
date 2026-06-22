import { useParams } from "react-router-dom";

import { TeamView } from "@/components/TeamView";
import { getTeam } from "@/lib/team";
import { getProjects, type Project } from "@/lib/projects";
import { useQuery } from "@/lib/useQuery";
import { useTitle } from "@/lib/useTitle";
import { NotFound } from "@/pages/NotFound";

export function MemberPage() {
    const { member: slug } = useParams<{ member: string }>();
    const { data, loading } = useQuery(getTeam, []);
    const { data: allProjects } = useQuery(getProjects, []);
    const member = data?.core.find((m) => m.slug === slug);

    useTitle(
        member
            ? `Applied Archive Atelier — ${member.name}`
            : "Applied Archive Atelier",
    );

    if (loading || !data) return null;
    if (!member) return <NotFound />;

    // Full project records for this member's work, in the member's own order,
    // so the "Selected work" section can render them in the homepage format.
    const work: Project[] = member.projects
        .map((mp) => allProjects?.find((p) => p.id === mp.id))
        .filter((p): p is Project => p !== undefined);

    return <TeamView selected={member} work={work} />;
}
