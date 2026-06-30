import { LocaleLink } from "@/components/LocaleLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/lib/SiteContentProvider";
import type { UiKey } from "@/lib/siteContent";

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
      { label: "Brique par Brique", to: "/projects/bxb" },
      { label: "chimie", to: "/projects/chimie" },
      { label: "CTRL+ALT", to: "/projects/ctrl" },
      { label: "Ecozoic", to: "/projects/ecozoic" },
      { label: "Ellipse Magazine", to: "/projects/ellipse" },
      { label: "Routes to Rootz", to: "/projects/routes-to-rootz" },
    ],
  },
  {
    labelKey: "navManifesto",
    to: "/about",
    items: [
      { label: "Manifesto", to: "/about#manifesto" },
      { label: "Approach", to: "/about#approach" },
      { label: "Capabilities", to: "/about#capabilities" },
    ],
  },
  {
    labelKey: "navTeam",
    to: "/team",
    items: [
      { label: "Jean-Julien Hazoumé", to: "/team/jean-julien" },
      { label: "Johnelle Smith", to: "/team/johnelle" },
      { label: "Jordane Kaluma", to: "/team/jordane" },
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

// Hover bar: green on the navbar's white ground, black (inverted) on the
// footer's green ground.
function NavHl({ inverted }: { inverted: boolean }) {
  return (
    <span
      data-nav-hl
      className={`absolute inset-0 scale-y-0 origin-top ${
        inverted ? "bg-black" : "bg-green"
      }`}
    />
  );
}

function MenuItemLink({
  item,
  inverted,
}: {
  item: MenuItem;
  inverted: boolean;
}) {
  const className = `relative flex items-center w-full ${
    inverted ? "transition-colors hover:text-green" : ""
  }`;
  const inner = (
    <>
      <NavHl inverted={inverted} />
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
// When `expanded` is false the submenu lists (and the language switcher) collapse
// to their headers (the Navbar drives this on scroll/hover); the Footer leaves it
// open. `inverted` flips the hover treatment for the footer's green background.
export function NavMenu({
  expanded = true,
  inverted = false,
}: {
  expanded?: boolean;
  inverted?: boolean;
}) {
  const t = useT();
  const linkHover = inverted ? "transition-colors hover:text-green" : "";
  const collapse = `hidden md:grid w-full transition-[grid-template-rows,opacity] duration-300 ease-out ${
    expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
  }`;
  return (
    <div className="grid grid-cols-18 gap-2 text-xs leading-[120%] border-b-black">
      {columns.map((col) => (
        <div key={col.to} className="col-span-4 grid grid-cols-2 gap-2">
          <LocaleLink
            to={col.to}
            data-nav-link
            data-nav-header
            className={`relative  flex items-start w-fit md:w-full h-fit col-span-2 md:col-span-1 ${linkHover}`}
          >
            <NavHl inverted={inverted} />
            <span className="relative z-10">{t(col.labelKey)}</span>
          </LocaleLink>
          <div className={collapse}>
            <div className="min-h-0 overflow-hidden flex flex-col w-full">
              {col.items.map((item) => (
                <MenuItemLink
                  key={item.label}
                  item={item}
                  inverted={inverted}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="col-span-2 flex flex-col items-end gap-2">
        <LocaleLink
          to="/contact"
          data-nav-link
          className={`relative flex items-center justify-end w-fit md:w-full ${linkHover}`}
        >
          <NavHl inverted={inverted} />
          <span className="relative z-10 font-normal">
            <span className="md:hidden text-nowrap">
              {t("letsTalk")} <span className="text-[10px]">↗</span>
            </span>
            <span className="hidden md:inline">
              {t("startConversation")} <span className="text-[10px]">↗</span>
            </span>
          </span>
        </LocaleLink>
        {/* Language switcher: desktop only (mobile shows it in the footer),
            spanning the column with the label right-aligned under the CTA, and
            collapsing with the submenus. */}
        <div className={collapse}>
          <div className="min-h-0 overflow-hidden">
            <LanguageSwitcher
              inverted={inverted}
              className="w-full justify-end"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
