import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Applied Archive Atelier — Initiatives",
};

export default function InitiativesPage() {
    return (
        <main className="flex flex-col justify-start px-2 w-full text-xs leading-[115%] md:h-screen pt-[calc(var(--nav-height)*1.2)] pb-2">
            <div className="grid grid-cols-18 gap-2 flex-1 min-h-0">
                <aside className="md:col-span-4 col-span-8 self-start flex flex-col gap-2 pb-12 md:pb-0">
                    <h1 className="uppercase">Initiatives</h1>

                    <p>
                        Some projects exist because they need to, not because
                        anyone paid for them. We carry these alongside the
                        studio — in service of the people they&apos;re built
                        for.
                    </p>
                </aside>

                <div className="col-span-10 md:col-span-14 grid grid-cols-14 gap-x-2 gap-y-[var(--nav-gap)] h-fit">
                    <div className="col-span-4 h-1 md:flex hidden" />
                    <article className="flex flex-col col-span-12 md:col-span-4 justify-start gap-8">
                        <div className="flex flex-col">
                            <h2 className="uppercase">Gia</h2>
                            <p className="opacity-70">
                                Grants, written and indexed
                            </p>
                            <p className="pt-2">
                                A grant writing tool and a searchable index —
                                built to help people find the funding they need
                                and ask for it well.
                            </p>
                        </div>
                        <a
                            href="https://www.instagram.com/gia.grants/"
                            data-nav-link
                            className="relative flex items-center w-fit"
                        >
                            <span
                                data-nav-hl
                                className="absolute inset-0 bg-green scale-y-0 origin-top"
                            />
                            <span className="relative z-10">
                                Visit <span className="text-[10px]">↗</span>
                            </span>
                        </a>
                    </article>

                    <article className="flex flex-col justify-start col-span-12 md:col-span-4 gap-8">
                        <div className="flex flex-col">
                            <h2 className="uppercase">DJTAL</h2>
                            <p className="opacity-70">An affordable DJ studio</p>
                            <p className="pt-2">
                                A place to practice and learn — turntables, open
                                hours, and mentorship, at a price that
                                doesn&apos;t gate the craft.
                            </p>
                        </div>
                        <a
                            href="https://djt.al"
                            data-nav-link
                            className="relative flex items-center w-fit"
                        >
                            <span
                                data-nav-hl
                                className="absolute inset-0 bg-green scale-y-0 origin-top"
                            />
                            <span className="relative z-10">
                                Visit <span className="text-[10px]">↗</span>
                            </span>
                        </a>
                    </article>

                    <article className="md:col-start-5 col-span-12 md:col-span-4 flex flex-col justify-start gap-8">
                        <div className="flex flex-col">
                            <h2 className="uppercase">Espace Septima</h2>
                            <p className="opacity-70">
                                Community space &amp; studio office
                            </p>
                            <p className="pt-2">
                                Applied Archive&apos;s home base — and a room
                                held open for non-profits and emerging creatives
                                who need a place to work, meet, and build.
                            </p>
                        </div>
                        <p className="opacity-70">Montréal, QC</p>
                    </article>
                </div>
            </div>
        </main>
    );
}
