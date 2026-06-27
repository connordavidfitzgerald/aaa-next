import { createContext, useContext, type ReactNode } from "react";

import { useLocale } from "@/lib/locale";
import { useQuery } from "@/lib/useQuery";
import {
  getSiteContent,
  type SiteContent,
  type UiKey,
} from "@/lib/siteContent";

interface SiteContentValue {
  content: SiteContent | null;
  /** Look up a global UI string; falls back to the key while loading. */
  t: (key: UiKey) => string;
}

const SiteContentContext = createContext<SiteContentValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { lang } = useLocale();
  // Re-fetches whenever the language changes (lang is in the dep array).
  const { data: content } = useQuery(() => getSiteContent(lang), [lang]);

  const t = (key: UiKey) => content?.ui[key] ?? "";

  return (
    <SiteContentContext.Provider value={{ content, t }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContentValue {
  const ctx = useContext(SiteContentContext);
  if (!ctx)
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  return ctx;
}

/** Convenience hook for components that only need the `t()` lookup. */
export function useT(): (key: UiKey) => string {
  return useSiteContent().t;
}
