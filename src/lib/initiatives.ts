import { sanity } from "@/lib/sanity";
import { loc } from "@/lib/i18n-groq";
import type { Lang } from "@/lib/locale";

export interface Initiative {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  url?: string;
  location?: string;
}

interface RawInitiative {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  description: string | null;
  url: string | null;
  location: string | null;
}

export async function getInitiatives(lang: Lang): Promise<Initiative[]> {
  const raw = await sanity.fetch<RawInitiative[]>(
    /* groq */ `*[_type == "initiative"] | order(order asc){
      "id": slug.current,
      title,
      "subtitle": ${loc("subtitle")},
      "image": image.asset->url,
      "description": ${loc("description")},
      url,
      "location": ${loc("location")}
    }`,
    { lang },
  );
  return raw.map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle ?? "",
    image: r.image ?? "",
    description: r.description ?? "",
    url: r.url ?? undefined,
    location: r.location ?? undefined,
  }));
}
