import { getInitiatives } from "@/lib/initiatives";
import { useQuery } from "@/lib/useQuery";
import { useTitle } from "@/lib/useTitle";

export function InitiativesPage() {
  useTitle("Applied Archive Atelier — Initiatives");

  const { data: initiatives } = useQuery(getInitiatives, []);

  return (
    <main className="flex flex-col justify-start px-2 w-full text-xs leading-[115%] md:pt-[calc(var(--nav-height)*1.2)] pb-2">
      <div className="grid grid-cols-18 gap-2 flex-1 min-h-0">
        <aside
          data-sticky-info
          className="md:col-span-4 col-span-18 self-start flex flex-col justify-start gap-2 pb-2 md:pb-0 bg-white sticky md:top-[calc(var(--nav-height)-0.5em)] top-0 z-40"
        >
          <div className="flex md:hidden h-[calc(var(--nav-height))]"></div>
          <h1>Initiatives</h1>

          <p>
            Five percent of every project goes into the projects part of A.A.A.
            ecosystem. Fuel for the adjacent projects we believe in, from Bloom
            to the work our own members start. Your budget keeps the ecosystem
            alive.
          </p>
        </aside>

        <div className="col-span-18 md:col-start-7 md:col-span-12 grid grid-cols-12 gap-x-2 gap-y-[var(--nav-gap)] h-fit">
          {(initiatives ?? []).map((initiative) => (
            <article
              key={initiative.id}
              className="flex flex-col col-span-12 justify-start gap-8"
            >
              <div className="flex flex-col">
                {initiative.image && (
                  <img
                    src={initiative.image}
                    alt={initiative.title}
                    className="w-full h-auto pb-2"
                  />
                )}
                <h2 className="uppercase">{initiative.title}</h2>
                <p className="opacity-70">{initiative.subtitle}</p>
                <p className="pt-2">{initiative.description}</p>
              </div>
              {initiative.url ? (
                <a
                  href={initiative.url}
                  data-nav-link
                  target="_blank"
                  className="relative flex items-center w-fit"
                >
                  <span
                    data-nav-hl
                    className="absolute inset-0 bg-green scale-y-0 origin-top"
                  />
                  <span className="relative z-10">
                    Visit <span className="text-[10px]">↗</span>
                  </span>
                </a>
              ) : initiative.location ? (
                <p className="opacity-70">{initiative.location}</p>
              ) : null}
            </article>
          ))}
        </div>
        <div className="h-40"></div>
      </div>
    </main>
  );
}
