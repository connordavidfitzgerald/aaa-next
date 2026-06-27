import { useEffect, useRef, type ReactNode } from "react";

import { sanityImageUrl } from "@/lib/image";

// Wraps a section and paints a cursor-following image trail behind its content.
// As the pointer moves across the area, project images are dropped at the cursor
// (one every MIN_DIST px), cycling through `images` so the trail alternates
// between projects. Each drop scales in and fades out. The content (children)
// sits above the trail and stays interactive; the trail layer is inert.
export function CursorImageTrail({
  images,
  children,
  className = "",
  id,
}: {
  images: string[];
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container || !layer || images.length === 0) return;
    // Skip on touch / no-hover devices and when reduced motion is requested.
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The trail thumbnails render small (~12rem), so request a matching size in
    // a modern format rather than the full-resolution originals.
    const optimized = images.map((src) =>
      sanityImageUrl(src, { width: 480, quality: 70 }),
    );

    // Warm the browser cache so dropped images appear instantly.
    optimized.forEach((src) => {
      const im = new Image();
      im.src = src;
    });

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const POOL = 18;
      const MIN_DIST = 90; // px of travel between drops
      const pool: HTMLImageElement[] = [];
      for (let i = 0; i < POOL; i++) {
        const img = document.createElement("img");
        img.className =
          "pointer-events-none absolute left-0 top-0 w-[clamp(7rem,12vw,12rem)] aspect-[4/5] object-cover opacity-0";
        img.decoding = "async";
        img.alt = "";
        gsap.set(img, { xPercent: -50, yPercent: -50 });
        layer.appendChild(img);
        pool.push(img);
      }

      let poolIndex = 0;
      let imgIndex = 0;
      let z = 0;
      let lastX = 0;
      let lastY = 0;
      let primed = false;

      const drop = (x: number, y: number) => {
        const el = pool[poolIndex];
        poolIndex = (poolIndex + 1) % POOL;
        el.src = optimized[imgIndex];
        imgIndex = (imgIndex + 1) % optimized.length;

        gsap.killTweensOf(el);
        gsap.set(el, {
          x,
          y,
          scale: 0.82,
          opacity: 1,

          zIndex: ++z,
        });
        gsap
          .timeline()
          .to(el, { scale: 1, duration: 0.35, ease: "power3.out" }, 0)
          .to(el, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.35);
      };

      const onMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (!primed) {
          primed = true;
          lastX = x;
          lastY = y;
          drop(x, y);
          return;
        }
        const dx = x - lastX;
        const dy = y - lastY;
        if (dx * dx + dy * dy < MIN_DIST * MIN_DIST) return;
        lastX = x;
        lastY = y;
        drop(x, y);
      };

      container.addEventListener("pointermove", onMove);
      cleanups.push(() => container.removeEventListener("pointermove", onMove));
      cleanups.push(() => {
        gsap.killTweensOf(pool);
        pool.forEach((el) => el.remove());
      });
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-2 text-center">
        {children}
      </div>
    </div>
  );
}
