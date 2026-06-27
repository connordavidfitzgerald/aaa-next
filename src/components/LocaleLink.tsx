import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

import { useLocale } from "@/lib/locale";

// A drop-in for react-router's <Link> that prefixes string `to` targets with the
// active language (`/team` → `/fr/team`). Hash-only and external targets, or
// non-string `to`, are passed through unchanged.
export const LocaleLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function LocaleLink({ to, ...props }, ref) {
    const { localizedPath } = useLocale();
    const resolved =
      typeof to === "string" && to.startsWith("/") ? localizedPath(to) : to;
    return <Link ref={ref} to={resolved} {...props} />;
  },
);
