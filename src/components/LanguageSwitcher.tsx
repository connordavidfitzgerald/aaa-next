import { Link } from "react-router-dom";

import { useLocale } from "@/lib/locale";

const LANG_NAMES: Record<string, string> = { en: "English", fr: "Français" };

// Switches to the *other* language, shown by its full name (e.g. "Français").
// Uses the shared nav-hover bar; `inverted` flips it to a black bar + green
// label for use on green backgrounds (the footer). `data-no-transition` keeps
// the page-transition click interceptor from swallowing the onClick, so the
// language choice is persisted.
export function LanguageSwitcher({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  const { otherLang, otherLangPath, persist } = useLocale();
  return (
    <Link
      to={otherLangPath}
      onClick={() => persist(otherLang)}
      data-no-transition
      data-nav-link
      className={`relative flex items-center ${
        inverted ? "transition-colors hover:text-green" : ""
      } ${className}`}
    >
      <span
        data-nav-hl
        className={`absolute inset-0 scale-y-0 origin-top ${
          inverted ? "bg-black" : "bg-green"
        }`}
      />
      <span className="relative z-10">{LANG_NAMES[otherLang]}</span>
    </Link>
  );
}
