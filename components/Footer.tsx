"use client";

import { useEffect, useRef } from "react";

import { NavMenu } from "@/components/NavMenu";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  // Hide the fixed navbar once the footer is reached (its top rises past the
  // middle of the viewport), and restore it on the way back up. Guarded so a
  // short page never hides the navbar while resting at the top. The navbar
  // transitions its own transform (see Navbar.tsx).
  useEffect(() => {
    const footer = footerRef.current;
    const nav = document.querySelector<HTMLElement>("[data-navbar]");
    if (!footer || !nav) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const reached =
        footer.getBoundingClientRect().top < window.innerHeight * 0.5;
      const atTop = window.scrollY < 50;
      nav.style.transform =
        reached && !atTop ? "translateY(-100%)" : "translateY(0)";
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      nav.style.transform = "translateY(0)";
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="flex flex-col justify-between min-h-[max(100vh,600px)] pb-2 px-2"
    >
      <div className=" pt-2">
        <NavMenu />
      </div>

      <svg
        viewBox="0 0 1888 496"
        className="w-full h-auto block"
        role="img"
        aria-label="Applied Archive Atelier"
      >
        <path
          d="M1887.6 495.138H1786.71L1742.13 378.696H1533.78L1489.21 495.138H1389.01L1584.92 0H1696.53L1887.6 495.138ZM1637.79 106.076L1566.61 293.696H1709.31L1637.79 106.076Z"
          fill="black"
        />
        <path
          d="M1343.75 495.135H1241.12V392.859H1343.75V495.135Z"
          fill="black"
        />
        <path
          d="M1193.1 495.138H1092.2L1047.63 378.696H839.279L794.706 495.138H694.504L890.417 0H1002.02L1193.1 495.138ZM943.282 106.076L872.104 293.696H1014.81L943.282 106.076Z"
          fill="black"
        />
        <path
          d="M649.242 495.135H546.621V392.859H649.242V495.135Z"
          fill="black"
        />
        <path
          d="M498.593 495.138H397.699L353.127 378.696H144.775L100.202 495.138H0L195.913 0H307.517L498.593 495.138ZM248.778 106.076L177.6 293.696H320.302L248.778 106.076Z"
          fill="black"
        />
      </svg>
    </footer>
  );
}
