import type { ImgHTMLAttributes } from "react";

import {
  sanityImageUrl,
  sanitySrcSet,
  DEFAULT_WIDTHS,
} from "@/lib/image";

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  /** Layout hint for the browser to pick a srcset candidate (default 100vw). */
  sizes?: string;
  /** Override the responsive width ladder (e.g. small thumbnails). */
  widths?: number[];
  quality?: number;
  /** Eagerly load (above-the-fold images that shouldn't be deferred). */
  eager?: boolean;
}

// <img> for Sanity-hosted images: emits an `auto=format` (WebP/AVIF) src plus a
// resolution-switching srcset/sizes, and lazy-loads by default. Non-Sanity srcs
// fall back to a plain optimized-free <img> so it's a safe drop-in anywhere.
export function SanityImage({
  src,
  sizes = "100vw",
  widths = DEFAULT_WIDTHS,
  quality,
  eager = false,
  alt = "",
  ...rest
}: Props) {
  const opts = { quality };
  const srcSet = sanitySrcSet(src, widths, opts);
  return (
    <img
      src={sanityImageUrl(src, { ...opts, width: widths[widths.length - 1] })}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...rest}
    />
  );
}
