import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Applied Archive Atelier — Contact",
};

export default function ContactPage() {
    return (
        <main className="flex flex-col justify-start px-2 w-full text-xs leading-[115%]">
            <div className="grid grid-cols-18 gap-2 pt-[calc(var(--nav-height)*1.2)] pb-[calc(var(--nav-height)*1.2)]">
                <aside className="col-span-18 md:col-span-4 self-start flex flex-col gap-2 md:sticky md:top-[calc(var(--nav-height)*1.2)] pb-12 md:pb-0">
                    <h1 className="uppercase">Start a conversation</h1>
                    <p className="opacity-70 pt-2">Get in touch</p>
                    <p>
                        Tell us what you&apos;re building. The work we take is
                        work worth doing together — if it matters to you and to
                        the people you serve, there&apos;s a place for it here.
                    </p>

                    <div className="flex flex-col gap-2 pt-4">
                        <p className="opacity-70">Direct</p>
                        <a
                            href="mailto:hello@appliedarchive.atelier"
                            data-nav-link
                            className="relative flex items-center w-fit"
                        >
                            <span
                                data-nav-hl
                                className="absolute inset-0 bg-green scale-y-0 origin-top"
                            />
                            <span className="relative z-10">
                                hello@appliedarchive.atelier
                            </span>
                        </a>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <p className="opacity-70">Studio</p>
                        <p>Montréal, QC</p>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <p className="opacity-70">Elsewhere</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a
                                href="#"
                                data-nav-link
                                className="relative flex items-center w-fit"
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
                                href="#"
                                data-nav-link
                                className="relative flex items-center w-fit"
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
                </aside>

                <form
                    method="POST"
                    action="#"
                    data-contact-form
                    className="col-span-18 md:col-span-14 flex flex-col gap-[calc(var(--space-l))]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[calc(var(--space-l))]">
                        <label className="flex flex-col gap-1">
                            <span className="opacity-70">Name</span>
                            <input
                                type="text"
                                name="name"
                                required
                                autoComplete="name"
                                className="bg-transparent border-b border-black focus:outline-none focus:border-green pb-1 leading-[115%]"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="opacity-70">Email</span>
                            <input
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                className="bg-transparent border-b border-black focus:outline-none focus:border-green pb-1 leading-[115%]"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[calc(var(--space-l))]">
                        <label className="flex flex-col gap-1">
                            <span className="opacity-70">
                                Organization (optional)
                            </span>
                            <input
                                type="text"
                                name="organization"
                                autoComplete="organization"
                                className="bg-transparent border-b border-black focus:outline-none focus:border-green pb-1 leading-[115%]"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="opacity-70">
                                Timeline (optional)
                            </span>
                            <input
                                type="text"
                                name="timeline"
                                placeholder="When are you hoping to start?"
                                className="bg-transparent border-b border-black focus:outline-none focus:border-green pb-1 leading-[115%] placeholder:opacity-40"
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-1">
                        <span className="opacity-70">
                            What are you building?
                        </span>
                        <textarea
                            name="message"
                            required
                            rows={10}
                            className="bg-transparent border-b border-black focus:outline-none focus:border-green pb-1 leading-[115%] resize-none"
                        />
                    </label>

                    <div className="flex flex-row justify-between items-end pt-2">
                        <p className="opacity-70 max-w-[28ch]">
                            We read every note ourselves and reply within a few
                            days.
                        </p>
                        <button
                            type="submit"
                            data-nav-link
                            className="relative flex items-center w-fit cursor-pointer"
                        >
                            <span
                                data-nav-hl
                                className="absolute inset-0 bg-green scale-y-0 origin-top"
                            />
                            <span className="relative z-10">
                                Send <span className="text-[10px]">↗</span>
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
