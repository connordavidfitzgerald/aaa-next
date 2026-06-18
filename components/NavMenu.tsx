import Link from "next/link";

const navHl = (
    <span
        data-nav-hl
        className="absolute inset-0 bg-green scale-y-0 origin-top"
    />
);

// The shared navigation menu (without the "Applied Archive Atelier" wordmark).
// Used by both the fixed Navbar and the page Footer so they stay identical.
export function NavMenu() {
    return (
        <div className="grid grid-cols-18 gap-2 text-xs leading-[120%] border-b-black">
            <div className="col-span-4 grid grid-cols-2 gap-2">
                <Link
                    href="/#projects"
                    data-nav-link
                    data-nav-header
                    className="relative opacity-70 flex items-start w-fit h-fit col-span-2 md:col-span-1"
                >
                    {navHl}
                    <span className="relative z-10">Selected Projects</span>
                </Link>
                <div className="hidden md:flex flex-col w-full">
                    {[
                        { href: "/projects/bxb", label: "Brique par brique" },
                        { href: "/projects/chimie", label: "Chimie" },
                        { href: "/projects/ctrl", label: "CTRL+ALT" },
                        { href: "/projects/ecozoic", label: "Ecozoic" },
                        { href: "/projects/ellipse", label: "Ellipse Magazine" },
                    ].map((p) => (
                        <Link
                            key={p.href}
                            href={p.href}
                            data-nav-link
                            className="relative flex items-center w-fit"
                        >
                            {navHl}
                            <span className="relative z-10">{p.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="col-span-4 grid grid-cols-2 gap-2">
                <Link
                    href="/manifesto"
                    data-nav-link
                    data-nav-header
                    className="relative opacity-70 flex items-start w-fit h-fit col-span-2 md:col-span-1"
                >
                    {navHl}
                    <span className="relative z-10">Manifesto</span>
                </Link>
                <div className="hidden md:flex flex-col w-full">
                    {[
                        { href: "/manifesto#welcome", label: "Welcome" },
                        { href: "/manifesto#craft", label: "Craft" },
                        { href: "/manifesto#amplify", label: "Amplify" },
                        { href: "/manifesto#cultivate", label: "Cultivate" },
                    ].map((m) => (
                        <Link
                            key={m.href}
                            href={m.href}
                            data-nav-link
                            className="relative flex items-center w-fit"
                        >
                            {navHl}
                            <span className="relative z-10">{m.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="col-span-4 grid grid-cols-2 gap-2">
                <Link
                    href="/team"
                    data-nav-link
                    data-nav-header
                    className="relative opacity-70 flex items-start w-fit h-fit col-span-2 md:col-span-1"
                >
                    {navHl}
                    <span className="relative z-10">Team</span>
                </Link>
                <div className="hidden md:flex flex-col w-full">
                    {[
                        { href: "/team/jean-julien", label: "Jean-Julien Hazoumé" },
                        { href: "/team/luckensy", label: "Luckensy Odigé" },
                        { href: "/team/jordane", label: "Jordane Kaluma" },
                        { href: "/team/reatchy", label: "Reatchy Legros" },
                        { href: "/team/johnelle", label: "Johnelle Smith" },
                    ].map((m) => (
                        <Link
                            key={m.href}
                            href={m.href}
                            data-nav-link
                            className="relative flex items-center w-fit"
                        >
                            {navHl}
                            <span className="relative z-10">{m.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="col-span-4 grid grid-cols-2 gap-2">
                <Link
                    href="/initiatives"
                    data-nav-link
                    data-nav-header
                    className="relative opacity-70 flex items-start w-fit h-fit col-span-2 md:col-span-1"
                >
                    {navHl}
                    <span className="relative z-10">Initiatives</span>
                </Link>
                <div className="hidden md:flex flex-col w-full">
                    <a
                        href="https://www.instagram.com/gia.grants/"
                        data-nav-link
                        className="relative flex items-center w-fit"
                    >
                        {navHl}
                        <span className="relative z-10">Gia</span>
                    </a>
                    <a
                        href="https://djt.al"
                        data-nav-link
                        className="relative flex items-center w-fit"
                    >
                        {navHl}
                        <span className="relative z-10">DJTAL</span>
                    </a>
                    <span
                        data-nav-link
                        className="relative flex items-center w-fit h-fit"
                    >
                        {navHl}
                        <span className="relative z-10">Espace Septima</span>
                    </span>
                </div>
            </div>
            <div className="col-span-2 flex flex-row justify-end items-start">
                <Link
                    href="/contact"
                    data-nav-link
                    className="relative flex items-center justify-end w-fit"
                >
                    {navHl}
                    <span className="relative z-10">
                        <span className="md:hidden text-nowrap">
                            Let&apos;s talk{" "}
                            <span className="text-[10px]">↗</span>
                        </span>
                        <span className="hidden md:inline">
                            Start a{" "}
                            <span className="text-nowrap">
                                conversation{" "}
                                <span className="text-[10px]">↗</span>
                            </span>
                        </span>
                    </span>
                </Link>
            </div>
        </div>
    );
}
