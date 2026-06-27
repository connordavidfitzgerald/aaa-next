// Resolve an internationalized-array field to the active language, falling back
// to English. Queries that use this must pass a `$lang` param to sanity.fetch.
//
// Plugin v5 stores the language on each item's `language` field (the data was
// migrated off the old `_key`-based scheme via `migrateToLanguageField`).
export const loc = (field: string) =>
  `coalesce(${field}[language == $lang][0].value, ${field}[language == "en"][0].value)`;

import type { Lang } from "@/lib/locale";

export type LangParam = { lang: Lang };
