import { notFound } from "next/navigation";

import { TeamView } from "@/components/TeamView";
import { core } from "@/lib/team";
import { projects } from "@/lib/projects";

export function generateStaticParams() {
    return core.map((m) => ({ member: m.slug }));
}

export default async function MemberPage({
    params,
}: {
    params: Promise<{ member: string }>;
}) {
    const { member: slug } = await params;
    const member = core.find((m) => m.slug === slug);
    if (!member) notFound();

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
