import { useEffect } from "react";

import manifestoBg from "@/assets/images/MANIFESTO.png";
import ManifestoLens from "@/components/ManifestoLens";

export function ManifestoPage() {
  useEffect(() => {
    document.title = "Applied Archive Atelier — Manifesto";
    const html = document.documentElement;
    const prevNavBg = html.style.getPropertyValue("--nav-bg");
    const prevPageBg = html.style.getPropertyValue("--page-bg");
    html.style.setProperty("--nav-bg", "var(--color-green)");
    html.style.setProperty("--page-bg", "var(--color-green)");

    return () => {
      html.style.setProperty("--nav-bg", prevNavBg || "white");
      html.style.setProperty("--page-bg", prevPageBg || "white");
    };
  }, []);

  return (
    <main className="flex flex-col justify-start px-2 w-full text-xs leading-[115%]">
      <div className="fixed inset-x-0 bottom-2 px-2 pointer-events-none">
        <img
          src={manifestoBg}
          alt="Manifesto"
          className="w-full opacity-6 block"
        />
      </div>

      <ManifestoLens />

      {/* Trailing slack so the final paragraph can glide to centre. */}
      <div aria-hidden className="h-[60vh] pointer-events-none" />
    </main>
  );
}
