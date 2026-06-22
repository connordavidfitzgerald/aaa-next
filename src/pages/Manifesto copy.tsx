import { useEffect } from "react";

import manifesto from "@/assets/svgs/MANIFESTO.svg";

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
    <main className="flex flex-col justify-start px-2 w-full text-xs  pt-[calc(var(--nav-height)-0.5em)] mt-2 min-h-screen">
      <div className="grid grid-cols-9 gap-2">
        <div className="flex flex-col col-span-6 justify-between h-full text-[14px] leading-[100%] font-medium text-justify tracking-[-0.02em] translate-y-[50%]">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2 flex flex-col gap-2">
              <div className="w-[50%] pr-2 flex flex-row justify-between items-center">
                <p>(</p>
                <p>01</p>
                <p>)</p>
              </div>
              <p className="uppercase">
                There is work you take because it pays. There is work you take
                because it interests you. And then there is the other kind. The
                kind that keeps you up. That work deserves more.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2 flex flex-col gap-2 col-start-3">
              <div className="w-[50%] pr-2 flex flex-row justify-between items-center">
                <p>(</p>
                <p>01</p>
                <p>)</p>
              </div>
              <p className="uppercase">
                There is work you take because it pays. There is work you take
                because it interests you. And then there is the other kind. The
                kind that keeps you up. That work deserves more.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 ">
            <div className="col-span-2 flex flex-col gap-2 col-start-5">
              <div className="w-[50%] pr-2 flex flex-row justify-between items-center">
                <p>(</p>
                <p>01</p>
                <p>)</p>
              </div>
              <p className="uppercase">
                There is work you take because it pays. There is work you take
                because it interests you. And then there is the other kind. The
                kind that keeps you up. That work deserves more.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2 flex flex-col gap-2 col-start-1">
              <div className="w-[50%] pr-2 flex flex-row justify-between items-center">
                <p>(</p>
                <p>01</p>
                <p>)</p>
              </div>
              <p className="uppercase">
                There is work you take because it pays. There is work you take
                because it interests you. And then there is the other kind. The
                kind that keeps you up. That work deserves more.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2 flex flex-col gap-2 col-start-5">
              <div className="w-[50%] pr-2 flex flex-row justify-between items-center">
                <p>(</p>
                <p>01</p>
                <p>)</p>
              </div>
              <p className="uppercase">
                There is work you take because it pays. There is work you take
                because it interests you. And then there is the other kind. The
                kind that keeps you up. That work deserves more.
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 col-start-9">
          <img src={manifesto} alt="Manifesto" className="w-full h-auto" />
        </div>
      </div>

      {/* Trailing slack so the final paragraph can glide to centre. */}
      <div aria-hidden className="h-[60vh] pointer-events-none" />
    </main>
  );
}
