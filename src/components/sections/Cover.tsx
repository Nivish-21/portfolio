import { Lettering } from "@/components/case/Lettering";
import { Sfx } from "@/components/case/Sfx";

/**
 * The cover of the folder, under the only lamp in the building.
 *
 * The light comes from one direction and never moves; every shadow on the site
 * agrees with it. The rain is lettered down the edge the way a comic letters it
 * into the panel border, rather than sitting on top as decoration.
 */
export function Cover() {
  return (
    <header className="relative overflow-hidden border-b border-file/[0.12] px-5 py-24 sm:py-28">
      {/* the lamp */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_62%_at_22%_-6%,rgba(232,180,92,0.22),transparent_62%)]"
      />
      {/* rain, drawn as ink hatching across the dark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(74deg,rgba(228,223,210,0.05)_0_1px,transparent_1px_7px)]"
      />
      <Sfx kind="rain" />

      <div className="relative mx-auto max-w-content">
        <p className="mb-5 inline-block border border-lamp/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-lamp">
          Case file · NVR · 001
        </p>

        <Lettering
          as="h1"
          className="block text-[clamp(2.75rem,9.5vw,6.75rem)] uppercase leading-[0.88]"
        >
          Nivish
          <br />
          <span className="text-transparent [-webkit-text-stroke:2px_var(--color-file)]">
            Vincent Raj
          </span>
        </Lettering>

        <p className="mt-6 max-w-[48ch] text-[17px] font-semibold leading-relaxed text-file/70">
          Founding CTO. Two companies taken from zero to one. Every system that
          breaks leaves evidence. My job is to read it before anyone else does.
        </p>
      </div>

      {/* CLOSED, slammed across the folder */}
      <Lettering
        aria-hidden="true"
        className="relative mt-8 inline-block -rotate-[11deg] border-[5px] border-thread px-5 py-2 text-[clamp(1.75rem,5vw,3.9rem)] uppercase tracking-[0.12em] text-thread opacity-80 lg:absolute lg:right-[6%] lg:top-[38%] lg:mt-0"
      >
        Closed
      </Lettering>
    </header>
  );
}
