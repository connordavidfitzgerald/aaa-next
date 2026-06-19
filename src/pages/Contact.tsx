import { BudgetSlider } from "@/components/BudgetSlider";
import { useTitle } from "@/lib/useTitle";

export function ContactPage() {
  useTitle("Applied Archive Atelier — Contact");

  return (
    <main className="flex flex-col px-2 text-xs leading-[120%] min-h-screen">
      <div className="flex md:flex-1 items-center pt-[calc(var(--nav-height)*1.2)] md:pt-[var(--nav-height)] md:pb-6">
        <div className="grid grid-cols-18 gap-2 w-full"></div>
      </div>

      <div className="mt-auto md:mt-0 border-t border-b border-black/20 pt-2 pb-4">
        <form
          method="POST"
          action="#"
          data-contact-form
          className="flex flex-col gap-4 md:grid md:grid-cols-18 md:gap-2 md:h-[calc(var(--contact-row)*2)]"
        >
          <div className="flex flex-col gap-4 md:col-span-12 md:grid md:grid-cols-12 md:grid-rows-2 md:gap-x-2 md:gap-y-0 md:h-full">
            {/* Row 1 */}
            <label className="col-span-4 flex flex-col justify-between gap-1 h-full">
              <span className="opacity-70">Name</span>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                className="bg-transparent border-b border-black/20 focus:outline-none focus:border-green pb-1 leading-[115%]"
              />
            </label>
            <label className="col-span-4 flex flex-col justify-between gap-1 h-full">
              <span className="opacity-70">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="bg-transparent border-b border-black/20 focus:outline-none focus:border-green pb-1 leading-[115%]"
              />
            </label>
            <label className="col-span-4 flex flex-col justify-between gap-1 h-full">
              <span className="opacity-70">Organization (optional)</span>
              <input
                type="text"
                name="organization"
                autoComplete="organization"
                className="bg-transparent border-b border-black/20 focus:outline-none focus:border-green pb-1 leading-[115%]"
              />
            </label>

            {/* Row 2 */}
            <label className="col-span-4 flex flex-col justify-between gap-1 h-full pt-2">
              <span className="opacity-70">Timeline (optional)</span>
              <input
                type="text"
                name="timeline"
                placeholder="When are you hoping to start?"
                className="bg-transparent border-b border-black/20 focus:outline-none focus:border-green pb-1 leading-[115%] placeholder:opacity-40"
              />
            </label>
            <BudgetSlider className="col-span-4 pt-2" />
            <label className="col-span-4 flex flex-col gap-1 h-full pt-2">
              <span className="opacity-70">What are you building?</span>
              <textarea
                name="message"
                required
                className="flex-1 min-h-24 md:min-h-0 bg-transparent border-b border-black/20 focus:outline-none focus:border-green pb-1 leading-[115%] resize-none"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 md:col-span-6 md:grid md:grid-cols-6 md:content-between md:gap-x-0 md:gap-y-2 md:h-full">
            <p className="col-start-3 col-span-4 opacity-70">
              The living projects start with a conversation. A coffee or a call,
              whatever&apos;s easiest for you. Every budget is welcome. We read
              it as energy. Tell us yours, and we&apos;ll be honest about what we
              can make with it, together.
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
                <span className="relative z-10">
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
