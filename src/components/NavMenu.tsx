import { Link } from "react-router-dom";

const navHl = (
  <span
    data-nav-hl
    className="absolute inset-0 bg-green scale-y-0 origin-top"
  />
);

type MenuItem = { label: string; to?: string; href?: string };
type MenuColumn = { label: string; to: string; items: MenuItem[] };

const columns: MenuColumn[] = [
  {
    label: "Selected Projects",
    to: "/#projects",
    items: [
      { label: "Brique par brique", to: "/projects/bxb" },
      { label: "Chimie", to: "/projects/chimie" },
      { label: "CTRL+ALT", to: "/projects/ctrl" },
      { label: "Ecozoic", to: "/projects/ecozoic" },
      { label: "Ellipse Magazine", to: "/projects/ellipse" },
    ],
  },
  {
    label: "Manifesto",
    to: "/manifesto",
    items: [
      { label: "Welcome", to: "/manifesto#welcome" },
      { label: "Craft", to: "/manifesto#craft" },
      { label: "Amplify", to: "/manifesto#amplify" },
      { label: "Cultivate", to: "/manifesto#cultivate" },
    ],
  },
  {
    label: "Team",
    to: "/team",
    items: [
      { label: "Jean-Julien Hazoumé", to: "/team/jean-julien" },
      { label: "Luckensy Odigé", to: "/team/luckensy" },
      { label: "Jordane Kaluma", to: "/team/jordane" },
      { label: "Reatchy Legros", to: "/team/reatchy" },
      { label: "Johnelle Smith", to: "/team/johnelle" },
    ],
  },
  {
    label: "Initiatives",
    to: "/initiatives",
    items: [
      { label: "Gia", href: "https://www.instagram.com/gia.grants/" },
      { label: "DJTAL", href: "https://djt.al" },
      { label: "Espace Septima" },
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
      <Link to={item.to} data-nav-link className={className}>
        {inner}
      </Link>
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
  return (
    <div className="grid grid-cols-18 gap-2 text-xs leading-[120%] border-b-black">
      {columns.map((col) => (
        <div key={col.to} className="col-span-4 grid grid-cols-2 gap-2">
          <Link
            to={col.to}
            data-nav-link
            data-nav-header
            className="relative  flex items-start w-full h-fit col-span-2 md:col-span-1"
          >
            {navHl}
            <span className="relative z-10">{col.label}</span>
          </Link>
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
        <Link
          to="/contact"
          data-nav-link
          className="relative flex items-center justify-end w-full"
        >
          {navHl}
          <span className="relative z-10 font-normal">
            <span className="md:hidden text-nowrap">
              Let&apos;s talk <span className="text-[10px]">↗</span>
            </span>
            <span className="hidden md:inline">
              Start a{" "}
              <span className="text-nowrap">
                conversation <span className="text-[10px]">↗</span>
              </span>
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
