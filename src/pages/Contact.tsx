import { useEffect, useRef, useState, type FormEvent } from "react";

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
  const [hasInput, setHasInput] = useState(false);
  const [sent, setSent] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  // Where the send button was pressed — the origin of the colour drop.
  const clickPos = useRef<{ x: number; y: number } | null>(null);

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

  // Procreate-style colour drop: a green disc planted at the click point and
  // scaled until it covers the whole viewport. Sized so its radius reaches the
  // farthest corner from the origin, so it always fills the screen.
  const playColorDrop = async (x: number, y: number) => {
    const el = dropRef.current;
    if (!el) return;

    const dx = Math.max(x, window.innerWidth - x);
    const dy = Math.max(y, window.innerHeight - y);
    const radius = Math.hypot(dx, dy);

    el.style.left = `${x - radius}px`;
    el.style.top = `${y - radius}px`;
    el.style.width = `${radius * 2}px`;
    el.style.height = `${radius * 2}px`;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const { gsap } = await import("gsap");
    gsap.fromTo(
      el,
      { scale: 0 },
      {
        scale: 1,
        duration: reduce ? 0 : 0.85,
        ease: "power2.out",
        transformOrigin: "center center",
      },
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sent) return;

    // No backend is wired yet, so a submit is treated as success: fire the
    // colour drop from where the button was pressed (falling back to the
    // viewport centre for keyboard submits).
    const pos = clickPos.current ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    setSent(true);
    playColorDrop(pos.x, pos.y);
  };

  return (
    <main className="relative flex flex-col px-2 text-xs leading-[120%] min-h-screen">
      <div className="relative z-10 flex md:flex-1 items-center justify-center pt-[calc(var(--nav-height)*1.2)] md:pt-[var(--nav-height)] md:pb-6">
        {sent ? (
          // On success the prompt is replaced in place by the confirmation.
          <p className="w-full text-center text-[clamp(1rem,3vw,3rem)] leading-[1.15] tracking-[-0.02em]">
            Thanks — we&apos;ll be in touch.
          </p>
        ) : (
          <label className="flex w-full flex-wrap items-baseline justify-center gap-[0.25em] text-[clamp(1rem,3vw,3rem)] leading-[1.15] tracking-[-0.02em]">
            <span className="shrink-0 whitespace-nowrap select-none">
              {typedPrefix}
            </span>
            {/* The example is a dimmed span rather than a native placeholder, so
                the (empty) textarea — and therefore the caret — sits right at
                the end of it instead of in the centre of the field. The span is
                dropped as soon as the visitor types. A textarea (not an input)
                lets the message wrap once it reaches the viewport width;
                field-sizing-content grows it to fit the text. */}
            <span className="relative inline-block max-w-full text-left align-baseline">
              {!hasInput && (
                <span
                  aria-hidden
                  className="pointer-events-none select-none opacity-30"
                >
                  {placeholder}
                </span>
              )}
              <textarea
                ref={messageRef}
                name="message"
                form="contact-form"
                aria-label="Your message"
                rows={1}
                onInput={(e) => setHasInput(e.currentTarget.value.length > 0)}
                // min-w keeps a sliver of width when empty so the caret (drawn
                // at the field's left edge, right after the placeholder) isn't
                // collapsed away by field-sizing-content / clipped by overflow.
                className="field-sizing-content min-w-[3px] max-w-full resize-none overflow-hidden bg-transparent align-baseline leading-[1.15] focus:outline-none"
              />
            </span>
          </label>
        )}
      </div>

      <div className="relative z-10 mt-auto md:mt-0 pb-6">
        <form
          id="contact-form"
          onSubmit={handleSubmit}
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
            {/* Sits in the empty cell beside the budget slider. */}
            <p className="col-span-4 pt-2">
              Every budget is welcome. We read it as energy. Tell us yours, and
              we&apos;ll be honest about what we can make with it, together.
            </p>
          </div>

          {/* The send button fills the column beside the form, bordered, with
              its label anchored to the bottom-left. */}
          <div className="md:col-span-6 md:h-full mt-4">
            <button
              type="submit"
              data-nav-link
              onPointerDown={(e) => {
                clickPos.current = { x: e.clientX, y: e.clientY };
              }}
              className="relative flex h-full min-h-32 w-full items-end justify-start overflow-hidden border border-black/20 p-2 cursor-pointer"
            >
              <span
                data-nav-hl
                className="absolute inset-0 bg-green scale-y-0 origin-top"
              />
              <span className="relative z-10">
                Send <span className="text-[10px]">↗</span>
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Colour-drop layer, behind the page content (z-0 vs the message/form's
          z-10) so the text and form stay legible as the green floods in. The
          disc is invisible (scale 0) until a successful send expands it to fill
          the viewport. */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          ref={dropRef}
          className="absolute rounded-full bg-green"
          style={{ width: 0, height: 0, transform: "scale(0)" }}
        />
      </div>
    </main>
  );
}
