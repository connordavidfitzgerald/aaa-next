import { Link } from "react-router-dom";

import { useTitle } from "@/lib/useTitle";

export function NotFound() {
    useTitle("Applied Archive Atelier — Not Found");

    return (
        <main className="flex flex-col justify-center items-center gap-4 min-h-screen px-2 text-xs">
            <h1 className="text-md font-bold">Page not found</h1>
            <Link
                to="/"
                data-nav-link
                className="relative flex items-center w-fit"
            >
                <span
                    data-nav-hl
                    className="absolute inset-0 bg-green scale-y-0 origin-top"
                />
                <span className="relative z-10">
                    Back home <span className="text-[10px]">↗</span>
                </span>
            </Link>
        </main>
    );
}
