import { useEffect } from "react";

export function LenisInit() {
    useEffect(() => {
        let lenis: { destroy: () => void } | null = null;
        let cancelled = false;

        (async () => {
            const Lenis = (await import("lenis")).default;
            const { gsap } = await import("gsap");
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            if (cancelled) return;

            gsap.registerPlugin(ScrollTrigger);

            const instance = new Lenis({ lerp: 0.2 });
            lenis = instance;
            (window as unknown as { lenis: typeof instance }).lenis = instance;

            instance.on("scroll", ScrollTrigger.update);

            gsap.ticker.add((time) => {
                instance.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        })();

        return () => {
            cancelled = true;
            lenis?.destroy();
        };
    }, []);

    return null;
}
