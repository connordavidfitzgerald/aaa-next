import { LocaleLink } from "@/components/LocaleLink";
import { useT } from "@/lib/SiteContentProvider";
import type { UiKey } from "@/lib/siteContent";

const navHl = (
  <span
    data-nav-hl
    className="absolute inset-0 bg-green scale-y-0 origin-top"
  />
);

type MenuItem = { label: string; to?: string; href?: string };
type MenuColumn = { labelKey: UiKey; to: string; items: MenuItem[] };

// The submenu sub-items are curated proper nouns (project / member / initiative
// names), so they aren't translated; the column headers and CTA come from the
// UI-strings singleton.
const columns: MenuColumn[] = [
  {
    labelKey: "navProjects",
    to: "/#projects",
    items: [
      { label: "Brique par brique", to: "/projects/bxb" },
      { label: "chimie", to: "/projects/chimie" },
      { label: "CTRL+ALT", to: "/projects/ctrl" },
      { label: "Ecozoic", to: "/projects/ecozoic" },
      { label: "Ellipse Magazine", to: "/projects/ellipse" },
    ],
  },
  {
    labelKey: "navManifesto",
    to: "/manifesto",
    items: [
      { label: "Approach", to: "/manifesto#capabilities" },
      { label: "Capabilities", to: "/manifesto#capabilities" },
      { label: "Labour of Love", to: "/manifesto#capabilities" },
    ],
  },
  {
    labelKey: "navTeam",
    to: "/team",
    items: [
      { label: "Jean-Julien Hazoumé", to: "/team/jean-julien" },
      { label: "Jordane Kaluma", to: "/team/jordane" },
      { label: "Johnelle Smith", to: "/team/johnelle" },
      { label: "Luckensy Odigé", to: "/team/luckensy" },
      { label: "Reatchy Legros", to: "/team/reatchy" },
    ],
  },
  {
    labelKey: "navInitiatives",
    to: "/initiatives",
    items: [
      { label: "DJTAL", href: "/initiatives" },
      { label: "Espace Septima", href: "/initiatives" },
      { label: "Gia", href: "/initiatives" },
    ],
  },
];

function MenuItemLink({ item }: { item: MenuItem }) {
  const className = "relative flex items-center w-full";
  const inner = (
    <>
      {navHl}
      <span className="relative z-10">{item.label}</span>
    </>
  );
  if (item.to) {
    return (
      <LocaleLink to={item.to} data-nav-link className={className}>
        {inner}
      </LocaleLink>
    );
  }
  if (item.href) {
    return (
      <a href={item.href} data-nav-link className={className}>
        {inner}
      </a>
    );
  }
  // No destination (e.g. Espace Septima): keep the hover highlight, no link.
  return (
    <span data-nav-link className={`${className} h-fit`}>
      {inner}
    </span>
  );
}

// The shared navigation menu (without the "Applied Archive Atelier" wordmark).
// Used by both the fixed Navbar and the page Footer so they stay identical.
// When `expanded` is false the submenu lists collapse to their headers (the
// Navbar drives this on scroll/hover); the Footer leaves it at the default so
// it is always fully open.
export function NavMenu({ expanded = true }: { expanded?: boolean }) {
  const t = useT();
  return (
    <div className="grid grid-cols-18 gap-2 text-xs leading-[120%] border-b-black">
      {columns.map((col) => (
        <div key={col.to} className="col-span-4 grid grid-cols-2 gap-2">
          <LocaleLink
            to={col.to}
            data-nav-link
            data-nav-header
            className="relative  flex items-start w-full h-fit col-span-2 md:col-span-1"
          >
            {navHl}
            <span className="relative z-10">{t(col.labelKey)}</span>
          </LocaleLink>
          <div
            className={`hidden md:grid w-full transition-[grid-template-rows,opacity] duration-300 ease-out ${
              expanded
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden flex flex-col w-full">
              {col.items.map((item) => (
                <MenuItemLink key={item.label} item={item} />
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="col-span-2 flex flex-row justify-end items-start">
        <LocaleLink
          to="/contact"
          data-nav-link
          className="relative flex items-center justify-end w-full"
        >
          {navHl}
          <span className="relative z-10 font-normal">
            <span className="md:hidden text-nowrap">
              {t("letsTalk")} <span className="text-[10px]">↗</span>
            </span>
            <span className="hidden md:inline">
              {t("startConversation")} <span className="text-[10px]">↗</span>
            </span>
          </span>
        </LocaleLink>
      </div>
    </div>
  );
}
