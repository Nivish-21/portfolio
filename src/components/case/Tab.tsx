import { Lettering } from "./Lettering";

/**
 * A section marker, in the world's own language: the tab on a case folder.
 * Deliberately not a heading with a rule under it — that repeated pattern is
 * the single most recognisable tell of a generated page.
 */
export function Tab({ children, id }: { children: string; id?: string }) {
  return (
    <div className="mt-20 flex items-end">
      <Lettering
        as="h2"
        id={id}
        className="scroll-mt-24 bg-file px-5 py-2.5 text-[15px] uppercase tracking-[0.18em] text-void [clip-path:polygon(0_0,92%_0,100%_100%,0_100%)]"
      >
        {children}
      </Lettering>
      <span aria-hidden="true" className="h-[3px] flex-1 bg-file" />
    </div>
  );
}
