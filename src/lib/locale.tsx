import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type Lang = "en" | "fr";

const STORAGE_KEY = "aaa-lang";

interface LocaleValue {
  lang: Lang;
  /** Prefix an internal path for the active language (`/team` → `/fr/team`). */
  localizedPath: (path: string) => string;
  /** The current page's path in the *other* language (for the footer toggle). */
  otherLang: Lang;
  otherLangPath: string;
  /** Persist an explicit language choice so auto-detect never overrides it. */
  persist: (lang: Lang) => void;
}

const LocaleContext = createContext<LocaleValue | null>(null);

// Strip a leading /fr so we can recompose the path in either language.
const barePath = (pathname: string) => {
  const stripped = pathname.replace(/^\/fr(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
};

const withLang = (lang: Lang, path: string) => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === "en") return clean;
  return clean === "/" ? "/fr" : `/fr${clean}`;
};

export function LocaleProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  // First-visit auto-detect: only from the English tree, and only once. A stored
  // choice (from the footer toggle or a previous visit) always wins; otherwise we
  // fall back to the browser language.
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current || lang !== "en") return;
    ran.current = true;
    let pref = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (pref !== "en" && pref !== "fr") {
      pref = navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
      localStorage.setItem(STORAGE_KEY, pref);
    }
    if (pref === "fr") {
      navigate(withLang("fr", barePath(pathname)) + search, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect the language in <html lang> for accessibility / SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LocaleValue>(() => {
    const otherLang: Lang = lang === "en" ? "fr" : "en";
    return {
      lang,
      localizedPath: (path: string) => withLang(lang, path),
      otherLang,
      otherLangPath: withLang(otherLang, barePath(pathname)) + search,
      persist: (l: Lang) => localStorage.setItem(STORAGE_KEY, l),
    };
  }, [lang, pathname, search]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
