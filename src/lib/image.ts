// Sanity's image CDN transforms on the fly via query params: `auto=format` serves
// AVIF/WebP to browsers that accept it, `w`/`h` resize, `q` sets quality. Using
// these instead of the raw `asset->url` cuts payloads ~80–90% with no visible
// quality loss. Non-Sanity URLs (local bundles, Mux thumbnails) pass through
// untouched so this helper is safe to call on any src.
const SANITY_CDN = "cdn.sanity.io";

export interface ImageOpts {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "max" | "crop" | "clip" | "min";
}

const isSanity = (src: string) => !!src && src.includes(SANITY_CDN);

// Sanity asset URLs encode the original pixel size in the filename
// (…-3000x2000.jpg); we read it so srcsets never request an upscale.
const originalWidth = (src: string): number | undefined => {
  const m = src.match(/-(\d+)x\d+\.\w+(?:$|\?)/);
  return m ? parseInt(m[1], 10) : undefined;
};

export function sanityImageUrl(src: string, opts: ImageOpts = {}): string {
  if (!isSanity(src)) return src;
  const url = new URL(src);
  const p = url.searchParams;
  p.set("auto", "format");
  p.set("fit", opts.fit ?? "max");
  p.set("q", String(opts.quality ?? 78));
  if (opts.width) p.set("w", String(Math.round(opts.width)));
  if (opts.height) p.set("h", String(Math.round(opts.height)));
  return url.toString();
}

// Default responsive widths spanning phone → large desktop / retina.
export const DEFAULT_WIDTHS = [384, 640, 828, 1080, 1440, 1920];

export function sanitySrcSet(
  src: string,
  widths: number[] = DEFAULT_WIDTHS,
  opts: ImageOpts = {},
): string | undefined {
  if (!isSanity(src)) return undefined;
  const maxW = originalWidth(src);
  // Keep widths up to the original, then cap at the original itself so the
  // largest candidate is always exactly the source resolution.
  let ws = widths;
  if (maxW) {
    ws = Array.from(new Set([...widths.filter((w) => w < maxW), maxW]));
  }
  return ws.map((w) => `${sanityImageUrl(src, { ...opts, width: w })} ${w}w`).join(", ");
}
