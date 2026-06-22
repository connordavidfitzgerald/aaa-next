import { createClient } from "@sanity/client";

// Read-only client against the public `production` dataset. The project id and
// dataset are not secrets (reads are public + CORS-gated), so they're inlined.
// `useCdn` serves cached responses from Sanity's edge for fast public reads.
export const sanity = createClient({
  projectId: "0uc9cjxv",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
