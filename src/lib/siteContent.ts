import { sanity } from "@/lib/sanity";
import { loc } from "@/lib/i18n-groq";
import type { Lang } from "@/lib/locale";

// Keys of the global UI-strings singleton. Kept as a const list so the GROQ
// projection and the `t()` type stay in sync.
export const UI_KEYS = [
  "navProjects",
  "navManifesto",
  "navTeam",
  "navInitiatives",
  "startConversation",
  "letsTalk",
  "viewProject",
  "visit",
  "backHome",
  "credits",
  "links",
  "teamCore",
  "teamCollaborators",
  "teamAllies",
  "pageNotFound",
  "titleTeam",
  "titleContact",
  "titleInitiatives",
  "titleManifesto",
  "titleNotFound",
] as const;

export type UiKey = (typeof UI_KEYS)[number];
export type UiStrings = Partial<Record<UiKey, string>>;

export interface ManifestoContent {
  stanzas: string[];
  approachLabel: string;
  approach: { term: string; description: string }[];
  stanceLabel: string;
  capabilitiesLabel: string;
  capabilities: { title: string; items: string[] }[];
}

export interface SiteContent {
  ui: UiStrings;
  home: { tagline: string; manifestoLinkLabel: string };
  manifesto: ManifestoContent;
  contact: {
    prefix: string;
    placeholders: string[];
    nameLabel: string;
    emailLabel: string;
    organizationLabel: string;
    timelineLabel: string;
    budgetCopy: string;
    sendLabel: string;
    sendingLabel: string;
    successMessage: string;
    validationMessage: string;
    errorMessage: string;
    emailSubject: string;
  };
  initiatives: { heading: string; intro: string };
  team: { outro: string; careersEmail: string };
}

const uiProjection = UI_KEYS.map((k) => `"${k}": ${loc(k)}`).join(",\n    ");

const QUERY = /* groq */ `{
  "ui": *[_id == "uiStrings"][0]{
    ${uiProjection}
  },
  "home": *[_id == "homePage"][0]{
    "tagline": ${loc("tagline")},
    "manifestoLinkLabel": ${loc("manifestoLinkLabel")}
  },
  "manifesto": *[_id == "manifestoPage"][0]{
    "stanzas": stanzas[]{ "body": ${loc("body")} },
    "approachLabel": ${loc("approachLabel")},
    "approach": approach[]{ "term": ${loc("term")}, "description": ${loc("description")} },
    "stanceLabel": ${loc("stanceLabel")},
    "capabilitiesLabel": ${loc("capabilitiesLabel")},
    "capabilities": capabilities[]{ "title": ${loc("title")}, "items": ${loc("items")} }
  },
  "contact": *[_id == "contactPage"][0]{
    "prefix": ${loc("prefix")},
    "placeholders": ${loc("placeholders")},
    "nameLabel": ${loc("nameLabel")},
    "emailLabel": ${loc("emailLabel")},
    "organizationLabel": ${loc("organizationLabel")},
    "timelineLabel": ${loc("timelineLabel")},
    "budgetCopy": ${loc("budgetCopy")},
    "sendLabel": ${loc("sendLabel")},
    "sendingLabel": ${loc("sendingLabel")},
    "successMessage": ${loc("successMessage")},
    "validationMessage": ${loc("validationMessage")},
    "errorMessage": ${loc("errorMessage")},
    "emailSubject": ${loc("emailSubject")}
  },
  "initiatives": *[_id == "initiativesPage"][0]{
    "heading": ${loc("heading")},
    "intro": ${loc("intro")}
  },
  "team": *[_id == "teamPage"][0]{
    "outro": ${loc("outro")},
    careersEmail
  }
}`;

interface RawSiteContent {
  ui: UiStrings | null;
  home: { tagline: string | null; manifestoLinkLabel: string | null } | null;
  manifesto: {
    stanzas: { body: string | null }[] | null;
    approachLabel: string | null;
    approach: { term: string | null; description: string | null }[] | null;
    stanceLabel: string | null;
    capabilitiesLabel: string | null;
    capabilities: { title: string | null; items: string | null }[] | null;
  } | null;
  contact: Record<string, string | null> | null;
  initiatives: { heading: string | null; intro: string | null } | null;
  team: { outro: string | null; careersEmail: string | null } | null;
}

const s = (v: string | null | undefined) => v ?? "";

export async function getSiteContent(lang: Lang): Promise<SiteContent> {
  const raw = await sanity.fetch<RawSiteContent>(QUERY, { lang });
  return {
    ui: raw.ui ?? {},
    home: {
      tagline: s(raw.home?.tagline),
      manifestoLinkLabel: s(raw.home?.manifestoLinkLabel),
    },
    manifesto: {
      stanzas: (raw.manifesto?.stanzas ?? []).map((st) => s(st.body)),
      approachLabel: s(raw.manifesto?.approachLabel),
      approach: (raw.manifesto?.approach ?? []).map((a) => ({
        term: s(a.term),
        description: s(a.description),
      })),
      stanceLabel: s(raw.manifesto?.stanceLabel),
      capabilitiesLabel: s(raw.manifesto?.capabilitiesLabel),
      // `items` is a newline-separated list per category.
      capabilities: (raw.manifesto?.capabilities ?? []).map((c) => ({
        title: s(c.title),
        items: s(c.items)
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      })),
    },
    contact: {
      prefix: s(raw.contact?.prefix),
      // One example message per line; the contact form cycles through them.
      placeholders: s(raw.contact?.placeholders)
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      nameLabel: s(raw.contact?.nameLabel),
      emailLabel: s(raw.contact?.emailLabel),
      organizationLabel: s(raw.contact?.organizationLabel),
      timelineLabel: s(raw.contact?.timelineLabel),
      budgetCopy: s(raw.contact?.budgetCopy),
      sendLabel: s(raw.contact?.sendLabel),
      sendingLabel: s(raw.contact?.sendingLabel),
      successMessage: s(raw.contact?.successMessage),
      validationMessage: s(raw.contact?.validationMessage),
      errorMessage: s(raw.contact?.errorMessage),
      emailSubject: s(raw.contact?.emailSubject),
    },
    initiatives: {
      heading: s(raw.initiatives?.heading),
      intro: s(raw.initiatives?.intro),
    },
    team: {
      outro: s(raw.team?.outro),
      careersEmail: s(raw.team?.careersEmail),
    },
  };
}
