import { LocaleLink } from "@/components/LocaleLink";
import { useTitle } from "@/lib/useTitle";
import { useT } from "@/lib/SiteContentProvider";

export function NotFound() {
    const t = useT();
    useTitle(`Applied Archive Atelier — ${t("titleNotFound")}`);

    return (
        <main className="flex flex-col justify-center items-center gap-4 min-h-screen px-2 text-xs">
            <h1 className="text-md font-bold">{t("pageNotFound")}</h1>
            <LocaleLink
                to="/"
                data-nav-link
                className="relative flex items-center w-fit"
            >
                <span
                    data-nav-hl
                    className="absolute inset-0 bg-green scale-y-0 origin-top"
                />
                <span className="relative z-10">
                    {t("backHome")} <span className="text-[10px]">↗</span>
                </span>
            </LocaleLink>
        </main>
    );
}
