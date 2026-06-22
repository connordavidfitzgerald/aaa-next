import { useNavigate } from "react-router-dom";

import { memberSlugByName } from "@/lib/team";

// Renders a person's name. If the name matches a team member it becomes a
// clickable link to their page with the green-bar hover effect; otherwise it's
// plain text. Uses onClick navigation (not an <a>) so it can sit inside the
// ProjectPreview card, which is itself a link, without nesting anchors. The
// hover is CSS-driven so it works for content rendered after route load.
export function MemberLink({ name }: { name: string }) {
  const navigate = useNavigate();
  const slug = memberSlugByName(name);

  if (!slug) return <>{name}</>;

  const go = () => navigate(`/team/${slug}`);

  return (
    <span
      role="link"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        go();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          go();
        }
      }}
      className="group relative inline-block w-fit cursor-pointer align-baseline"
    >
      <span className="absolute inset-0 bg-green origin-top scale-y-0 transition-transform duration-200 ease-out group-hover:scale-y-100" />
      <span className="relative z-10">{name}</span>
    </span>
  );
}
