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
  // Bumped after the success sequence to remount the message + form to their
  // pristine, page-load state (clears inputs, resets the budget slider, etc.).
  const [runKey, setRunKey] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const editableRef = useRef<HTMLSpanElement>(null);
  const messageValueRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const whiteDropRef = useRef<HTMLDivElement>(null);
  // Where the send button was pressed — the origin of the colour drop.
  const clickPos = useRef<{ x: number; y: number } | null>(null);

  // Focus the message field so the caret blinks there, ready to type — on load
  // and again after a reset (runKey remounts the field).
  useEffect(() => {
    editableRef.current?.focus({ preventScroll: true });
  }, [runKey]);

  // Flag the page on <html> so the navbar background can go transparent (see
  // index.css) and the success colour drop shows through behind it.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-contact", "");
    return () => root.removeAttribute("data-contact");
  }, []);

  // The type-on intro, replayed whenever the form is reset (runKey changes).
  useEffect(() => {
    setTypedPrefix("");
    setPlaceholder("");

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
  }, [runKey]);

  // After a reset, the fresh message + form are committed behind the covering
  // white disc; collapse both discs to reveal the pristine page underneath.
  useEffect(() => {
    if (runKey === 0) return;
    [dropRef.current, whiteDropRef.current].forEach((el) => {
      if (el) el.style.transform = "scale(0)";
    });
  }, [runKey]);

  // Position and size a disc so it's centred on (ox, oy) and its radius reaches
  // the farthest viewport corner — i.e. scaling it to 1 always fills the screen.
  const sizeDisc = (el: HTMLElement, ox: number, oy: number) => {
    const dx = Math.max(ox, window.innerWidth - ox);
    const dy = Math.max(oy, window.innerHeight - oy);
    const radius = Math.hypot(dx, dy);
    el.style.left = `${ox - radius}px`;
    el.style.top = `${oy - radius}px`;
    el.style.width = `${radius * 2}px`;
    el.style.height = `${radius * 2}px`;
  };

  // The full success sequence, as one timeline:
  //  1. green floods in from the click point while the fields' values + message
  //     wipe down out of their masks;
  //  2. the confirmation rises up into the message's place;
  //  3. it holds long enough to read;
  //  4. the confirmation wipes back down;
  //  5. a white disc drops out from the centre, returning the page to white.
  // onComplete remounts the form to its pristine state (see runKey).
  const runSuccessSequence = async (x: number, y: number) => {
    const root = mainRef.current;
    const green = dropRef.current;
    const white = whiteDropRef.current;
    if (!root || !green || !white) return;

    const { gsap } = await import("gsap");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const d = (s: number) => (reduce ? 0 : s);
    const hold = 1.6; // read time, kept even under reduced motion

    const hideLines = root.querySelectorAll("[data-hide-line]");
    const riseLines = root.querySelectorAll("[data-rise-line]");

    // The white drop emerges from the centre of where the confirmation sits.
    const successBox = (riseLines[0] as HTMLElement | undefined)?.parentElement;
    const box = successBox?.getBoundingClientRect();
    const wx = box ? box.left + box.width / 2 : window.innerWidth / 2;
    const wy = box ? box.top + box.height / 2 : window.innerHeight / 2;

    sizeDisc(green, x, y);
    sizeDisc(white, wx, wy);
    gsap.set([green, white], { scale: 0 });
    gsap.set(root.querySelectorAll("[data-mask]"), { clipPath: "inset(0)" });

    const tl = gsap.timeline({ onComplete: resetForm });
    tl.to(green, { scale: 1, duration: d(0.85), ease: "power2.out" }, 0);
    tl.to(
      hideLines,
      {
        yPercent: 100,
        duration: d(0.5),
        ease: "power3.in",
        stagger: d(0.05),
      },
      0,
    );
    tl.fromTo(
      riseLines,
      { yPercent: 110, autoAlpha: 1 },
      { yPercent: 0, duration: d(0.6), ease: "power3.out" },
      d(0.45),
    );
    tl.to(
      riseLines,
      { yPercent: 110, duration: d(0.5), ease: "power3.in" },
      `+=${hold}`,
    );
    tl.to(white, { scale: 1, duration: d(0.85), ease: "power2.out" });
  };

  // Return the form to its page-load state by remounting it (runKey) once the
  // white disc is covering, so the reset never flashes the wiped fields.
  const resetForm = () => {
    setSent(false);
    setHasInput(false);
    setRunKey((k) => k + 1);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sent) return;

    // No backend is wired yet, so a submit is treated as success: run the
    // sequence from where the button was pressed (falling back to the viewport
    // centre for keyboard submits).
    const pos = clickPos.current ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    setSent(true);
    runSuccessSequence(pos.x, pos.y);
  };

  return (
    <main
      ref={mainRef}
      className="relative flex flex-col px-2 text-xs leading-[120%] min-h-screen"
    >
      <div
        key={`hero-${runKey}`}
        className="relative z-10 flex md:flex-1 items-center justify-center pt-[calc(var(--nav-height)*1.2)] md:pt-[var(--nav-height)] md:pb-6"
      >
        <div className="relative w-full">
          {/* The prompt; wipes down out of its mask on success. The prefix,
              dimmed example, and the editable region are all inline text in one
              centred flow, so "Hi there," and the message wrap together and
              centre as a single block (a textarea couldn't — it's a separate
              box). The example is a dimmed span the caret sits at the end of,
              dropped once the visitor types. */}
          <div data-mask>
            <div
              data-hide-line
              onMouseDown={(e) => {
                // The empty editable is a tiny target; clicking anywhere on the
                // prompt focuses it (caret lands after the placeholder).
                if (e.target !== editableRef.current) {
                  e.preventDefault();
                  editableRef.current?.focus();
                }
              }}
              className="w-full cursor-text text-center text-[clamp(1rem,3vw,3rem)] leading-[1.15] tracking-[-0.02em]"
            >
              <span key="prefix" className="select-none whitespace-pre-wrap">
                {typedPrefix ? `${typedPrefix} ` : typedPrefix}
              </span>
              {!hasInput && (
                <span
                  key="placeholder"
                  aria-hidden
                  className="select-none opacity-30"
                >
                  {placeholder}
                </span>
              )}
              <span
                key="editable"
                ref={editableRef}
                role="textbox"
                aria-label="Your message"
                contentEditable
                suppressContentEditableWarning
                onKeyDown={(e) => {
                  // Keep Enter as a plain line break instead of letting the
                  // browser split the flow into block elements.
                  if (e.key === "Enter") {
                    e.preventDefault();
                    document.execCommand("insertLineBreak");
                  }
                }}
                onInput={(e) => {
                  const text = e.currentTarget.innerText;
                  setHasInput(text.trim().length > 0);
                  if (messageValueRef.current)
                    messageValueRef.current.value = text;
                }}
                className="whitespace-pre-wrap outline-none"
              />
            </div>
          </div>
          <input
            ref={messageValueRef}
            type="hidden"
            name="message"
            form="contact-form"
          />

          {/* The confirmation, overlaid in the same spot. The mask is a
              full-width block whose height is exactly the line of text, so the
              translate-110% always fully hides it (no matter how tall the
              message above grew) and the rise cleanly reveals it on success. */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden={!sent}
          >
            <div className="w-full overflow-hidden">
              <p
                data-rise-line
                // Hidden via `invisible` (not an inline transform) so a React
                // re-render can't reset it mid-animation; GSAP owns the position
                // and visibility from here (autoAlpha makes it visible as it
                // rises, then it's masked away again when it wipes back down).
                className="invisible w-full text-center text-[clamp(1rem,3vw,3rem)] leading-[1.15] tracking-[-0.02em]"
              >
                Thanks — we&apos;ll be in touch.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        key={`form-${runKey}`}
        className={`relative z-10 mt-auto md:mt-0 pb-6 ${
          sent ? "pointer-events-none" : ""
        }`}
      >
        <form
          id="contact-form"
          onSubmit={handleSubmit}
          data-contact-form
          className="flex flex-col gap-4 md:grid md:grid-cols-18 md:gap-2 "
        >
          <div className="flex flex-col gap-4 md:col-span-12 md:grid md:grid-cols-12 md:grid-rows-2 md:gap-x-2 md:gap-y-0 md:h-full">
            {/* Row 1 — only the typed value masks/clears on send: the bottom
                border lives on the mask wrapper, so it stays put as the baseline
                while the input text wipes down beneath it; the caption stays. */}
            <label className="col-span-4 flex flex-col gap-1">
              <span
                data-mask
                className="block border-b border-black/20 focus-within:border-green"
              >
                <input
                  data-hide-line
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  className="block w-full bg-transparent focus:outline-none leading-[115%]"
                />
              </span>
              <span className="">Name</span>
            </label>
            <label className="col-span-4 flex flex-col gap-1">
              <span
                data-mask
                className="block border-b border-black/20 focus-within:border-green"
              >
                <input
                  data-hide-line
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="block w-full bg-transparent focus:outline-none leading-[115%]"
                />
              </span>
              <span className="">Email</span>
            </label>
            <label className="col-span-4 flex flex-col gap-1">
              <span
                data-mask
                className="block border-b border-black/20 focus-within:border-green"
              >
                <input
                  data-hide-line
                  type="text"
                  name="organization"
                  autoComplete="organization"
                  className="block w-full bg-transparent focus:outline-none leading-[115%]"
                />
              </span>
              <span className="">Organization (optional)</span>
            </label>

            {/* Row 2 */}
            <label className="col-span-4 flex flex-col gap-1 pt-2">
              <span
                data-mask
                className="block border-b border-black/20 focus-within:border-green"
              >
                <input
                  data-hide-line
                  type="text"
                  name="timeline"
                  className="block w-full bg-transparent focus:outline-none leading-[115%] placeholder:opacity-40"
                />
              </span>
              <span className="">
                When are you hoping the project to be done?
              </span>
            </label>
            {/* Budget slider and the copy beside it stay put on send. */}
            <BudgetSlider className="col-span-4 pt-3" />
            <p className="col-span-4 pt-2">
              Every budget is welcome. We read it as energy. Tell us yours, and
              we&apos;ll be honest about what we can make with it, together.
            </p>
          </div>

          {/* The send button fills the column beside the form, bordered, with
              its label anchored to the bottom-left. It stays put on success
              (no hide animation). */}
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
          z-10) so the text and form stay legible as the discs flood in. Both
          discs sit at scale 0 until a send: the green floods the page on
          success, then the white drops out from the centre to restore it. */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          ref={dropRef}
          className="absolute rounded-full bg-green"
          style={{ width: 0, height: 0, transform: "scale(0)" }}
        />
        <div
          ref={whiteDropRef}
          className="absolute rounded-full bg-[var(--page-bg)]"
          style={{ width: 0, height: 0, transform: "scale(0)" }}
        />
      </div>
    </main>
  );
}
