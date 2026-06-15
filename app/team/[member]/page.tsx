import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

    const memberProjects = member.projectIds
        .map((id) => projects.find((p) => p.id === id))
        .filter((p): p is (typeof projects)[number] => Boolean(p));

    return (
        <main className="flex flex-col justify-start px-2 w-full h-fit text-xs leading-[115%]">
            <div className="pt-[calc(var(--nav-height)*1.2)] grid grid-cols-1 md:grid-cols-18 gap-2 w-full items-stretch md:items-start mb-2 pb-2 md:pb-0">
                <div className="md:col-span-8 flex flex-col justify-between gap-2 md:gap-0 min-h-[calc(100svh-var(--nav-height)*1.2-1rem)] md:min-h-0 md:h-[calc(100svh-var(--nav-height)*1.2-1rem)] md:sticky md:top-[calc(var(--nav-height)*1.2)] md:self-start">
                    <div className="w-full flex flex-col justify-start">
                        <Link
                            href="/team"
                            data-nav-link
                            className="relative w-fit py-2 md:py-0 mb-4 flex items-center"
                        >
                            <span
                                data-nav-hl
                                className="absolute inset-0 bg-green scale-y-0 origin-top"
                            />
                            <span className="relative z-10">← BACK</span>
                        </Link>
                        <div className="grid grid-cols-8 gap-x-2 gap-y-6 md:gap-y-4 pb-2 md:pb-8">
                            <div className="col-span-5 row-start-1 h-full flex flex-col justify-between md:hidden">
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <p>{member.name}</p>
                                        <p className="opacity-70">
                                            {member.role}
                                        </p>
                                    </div>
                                    <p>{member.bio}</p>
                                </div>
                                <div className="grid grid-cols-4 gap-x-2">
                                    <a
                                        href={member.instagram}
                                        data-nav-link
                                        className="col-span-2 relative flex items-center w-fit"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span
                                            data-nav-hl
                                            className="absolute inset-0 bg-green scale-y-0 origin-top"
                                        />
                                        <span className="relative z-10">
                                            Instagram{" "}
                                            <span className="text-[10px]">
                                                ↗
                                            </span>
                                        </span>
                                    </a>
                                    <a
                                        href={member.linkedin}
                                        data-nav-link
                                        className="col-span-2 relative flex items-center w-fit"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span
                                            data-nav-hl
                                            className="absolute inset-0 bg-green scale-y-0 origin-top"
                                        />
                                        <span className="relative z-10">
                                            LinkedIn{" "}
                                            <span className="text-[10px]">
                                                ↗
                                            </span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div className="col-span-3 row-start-1 md:row-start-2 aspect-square">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover block"
                                />
                            </div>

                            <div className="hidden md:block md:col-start-1 md:col-span-3 md:row-start-1">
                                <p>{member.name}</p>
                                <p className="opacity-70">{member.role}</p>
                            </div>
                            <div className="hidden md:grid md:col-start-5 md:col-span-4 md:row-start-1 md:row-span-2 grid-cols-4 gap-x-2 gap-y-4 h-fit">
                                <p className="col-span-3 pb-8">{member.bio}</p>
                                <a
                                    href={member.instagram}
                                    data-nav-link
                                    className="col-span-2 relative flex items-center w-fit"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span
                                        data-nav-hl
                                        className="absolute inset-0 bg-green scale-y-0 origin-top"
                                    />
                                    <span className="relative z-10">
                                        Instagram{" "}
                                        <span className="text-[10px]">↗</span>
                                    </span>
                                </a>
                                <a
                                    href={member.linkedin}
                                    data-nav-link
                                    className="col-span-2 relative flex items-center w-fit"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span
                                        data-nav-hl
                                        className="absolute inset-0 bg-green scale-y-0 origin-top"
                                    />
                                    <span className="relative z-10">
                                        LinkedIn{" "}
                                        <span className="text-[10px]">↗</span>
                                    </span>
                                </a>
                            </div>
                        </div>
                        <div className="flex md:hidden opacity-70 pt-10 pb-1">
                            Selected Projects
                        </div>
                        <div className="md:hidden flex flex-col gap-2 md:pb-4">
                            {memberProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="block w-full"
                                >
                                    {project.image ? (
                                        <Image
                                            src={project.image}
                                            alt={project.client}
                                            className="w-full h-auto block"
                                        />
                                    ) : project.thumbnail ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={project.thumbnail}
                                            alt={project.client}
                                            className="w-full h-auto block"
                                        />
                                    ) : null}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex flex-col justify-end">
                        <div className="grid grid-cols-8 h-fit">
                            <p className="col-span-8 md:col-span-6 w-full">
                                Though our team is small by design, we&apos;re
                                always open to building relationships with
                                standout creatives whose values strongly align
                                with ours. If our approach resonates with you,
                                we&apos;d love to hear from you at
                                jobs@appliedarchive.com.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex md:col-span-10 flex-col gap-2 self-start">
                    {memberProjects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="block w-full"
                        >
                            {project.image ? (
                                <Image
                                    src={project.image}
                                    alt={project.client}
                                    className="w-full h-auto block"
                                />
                            ) : project.thumbnail ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={project.thumbnail}
                                    alt={project.client}
                                    className="w-full h-auto block"
                                />
                            ) : null}
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
