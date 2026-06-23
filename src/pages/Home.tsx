import { getProjects } from "@/lib/projects";
import { useQuery } from "@/lib/useQuery";
import { HomeHeroMux } from "@/components/HomeHeroMux";
import { ProjectPreview } from "@/components/ProjectPreview";

export function HomePage() {
  const { data: projects } = useQuery(getProjects, []);

  return (
    <main className="flex flex-col justify-start px-2 pb-2">
      <section
        id="video"
        className="h-screen flex flex-col justify-end items-center pb-2 min-h-200"
      >
        <HomeHeroMux />
      </section>
      <section
        id="tagline"
        className="w-full aspect-video flex flex-col justify-center items-center"
      >
        <h3 className="text-md bg-green leading-[120%] px-1 pt-0.5 uppercase font-bold tracking-[-0.02em]">
          Some work is worth doing together.
        </h3>
      </section>
      <section
        id="projects"
        className="flex flex-col w-full gap-25 scroll-mt-[calc(var(--nav-height)*1.2)]"
      >
        <div className="flex flex-col gap-25 font-normal tracking-[-0.01em]">
          {(projects ?? []).map((project) => (
            <ProjectPreview key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
