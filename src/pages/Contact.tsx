import { useEffect, useRef, useState } from "react";

import { BudgetSlider } from "@/components/BudgetSlider";
import { useTitle } from "@/lib/useTitle";

// The opening line types itself out on load: first the fixed "Hi there,"
// prefix, then the example message which lands as the input's placeholder.
const PREFIX = "Hi there,";
const PLACEHOLDER = "my non profit organisation needs a new website.";
const TYPE_SPEED = 45; // ms per character
const START_DELAY = 350; // ms before typing begins

export function ContactPage() {
  useTitle("Applied Archive Atelier — Contact");

  const [typedPrefix, setTypedPrefix] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const messageRef = useRef<HTMLInputElement>(null);

  // Focus the message field on load so the caret blinks there, ready to type.
  // preventScroll keeps the page from jumping to it.
  useEffect(() => {
    messageRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedPrefix(PREFIX);
      setPlaceholder(PLACEHOLDER);
      return;
    }

    const full = PREFIX + PLACEHOLDER;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const type = () => {
      i += 1;
      setTypedPrefix(full.slice(0, Math.min(i, PREFIX.length)));
      setPlaceholder(i > PREFIX.length ? full.slice(PREFIX.length, i) : "");
      if (i < full.length) timer = setTimeout(type, TYPE_SPEED);
    };

    timer = setTimeout(type, START_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex flex-col px-2 text-xs leading-[120%] min-h-screen">
      <div className="flex md:flex-1 items-center pt-[calc(var(--nav-height)*1.2)] md:pt-[var(--nav-height)] md:pb-6">
        <label className="flex w-full items-baseline gap-[0.25em] text-[clamp(1rem,3vw,3rem)] leading-[1.15] tracking-[-0.02em]">
          <span className="shrink-0 whitespace-nowrap select-none">
            {typedPrefix}
          </span>
          <input
            ref={messageRef}
            type="text"
            name="message"
            form="contact-form"
            aria-label="Your message"
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent focus:outline-none placeholder:opacity-30"
          />
        </label>
      </div>

      <div className="mt-auto md:mt-0 pb-6">
        <form
          id="contact-form"
          method="POST"
          action="#"
          data-contact-form
          className="flex flex-col gap-4 md:grid md:grid-cols-18 md:gap-2 "
        >
          <div className="flex flex-col gap-4 md:col-span-12 md:grid md:grid-cols-12 md:grid-rows-2 md:gap-x-2 md:gap-y-0 md:h-full">
            {/* Row 1 */}
            <label className="col-span-4 flex flex-col gap-1">
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                className="bg-transparent border-b border-black/20 focus:outline-none focus:border-green leading-[115%]"
              />
              <span className="">Name</span>
            </label>
            <label className="col-span-4 flex flex-col gap-1">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="bg-transparent border-b border-black/20 focus:outline-none focus:border-green leading-[115%]"
              />
              <span className="">Email</span>
            </label>
            <label className="col-span-4 flex flex-col gap-1">
              <input
                type="text"
                name="organization"
                autoComplete="organization"
                className="bg-transparent border-b border-black/20 focus:outline-none focus:border-green leading-[115%]"
              />
              <span className="">Organization (optional)</span>
            </label>

            {/* Row 2 */}
            <label className="col-span-4 flex flex-col gap-1 pt-2">
              <input
                type="text"
                name="timeline"
                className="bg-transparent border-b border-black/20 focus:outline-none focus:border-green leading-[115%] placeholder:opacity-40"
              />
              <span className="">
                When are you hoping the project to be done?
              </span>
            </label>
            <BudgetSlider className="col-span-4 pt-3" />
          </div>

          <div className="flex flex-col gap-4 md:col-span-6 md:grid md:grid-cols-6 md:content-between md:gap-x-0 md:gap-y-2 md:h-full">
            <p className="col-start-3 col-span-4 pt-3 ">
              The living projects start with a conversation. A coffee or a call,
              whatever&apos;s easiest for you. Every budget is welcome. We read
              it as energy. Tell us yours, and we&apos;ll be honest about what
              we can make with it, together.
            </p>
            <div className="col-span-6 flex justify-end items-end">
              <button
                type="submit"
                data-nav-link
                className="relative flex items-center w-fit cursor-pointer"
              >
                <span
                  data-nav-hl
                  className="absolute inset-0 bg-green scale-y-0 origin-top"
                />
                <span className="relative z-10 -mb-4">
                  Send <span className="text-[10px]">↗</span>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
