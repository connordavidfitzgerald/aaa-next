import { useTransitionNavigate } from "@/components/PageTransition";
import { useTeam } from "@/lib/TeamContext";
import { useLocale } from "@/lib/locale";

// Renders a person's name. If the name matches a team member it becomes a
// clickable link to their page with the green-bar hover effect; otherwise it's
// plain text. Uses onClick navigation (not an <a>) so it can sit inside the
// ProjectPreview card, which is itself a link, without nesting anchors. The
// hover is CSS-driven so it works for content rendered after route load.
//
// `fill` makes the link span its column at the text's height with the bar
// growing from the top — matching the navbar's hover (used in project credits).
// The default is inline, for names that flow within a line of text.
export function MemberLink({
  name,
  fill = false,
}: {
  name: string;
  fill?: boolean;
}) {
  const navigate = useTransitionNavigate();
  const { memberSlugByName } = useTeam();
  const { localizedPath } = useLocale();
  const slug = memberSlugByName(name);

  if (!slug) return <>{name}</>;

  const go = () => navigate(localizedPath(`/team/${slug}`));

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
      className={`group relative cursor-pointer ${
        fill
          ? "flex items-center w-full self-start"
          : "inline-block w-fit align-baseline"
      }`}
    >
      <span className="absolute inset-0 bg-green origin-top scale-y-0 transition-transform duration-200 ease-out group-hover:scale-y-100" />
      <span className="relative z-10">{name}</span>
    </span>
  );
}
