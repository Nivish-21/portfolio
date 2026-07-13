import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

interface LetteringProps extends ComponentPropsWithoutRef<"span"> {
  children: ReactNode;
  className?: string;
  /** Defaults to a span; pass "h1"/"h2" where the heading level matters. */
  as?: ElementType;
}

/**
 * Anything set in the display face goes through here.
 *
 * The squeeze that corrects the Anton fallback back to Impact's width is a
 * `transform: scaleX()`, and a transform does not resize the layout box. So the
 * scaled thing must be an inline-block that hugs its own glyphs, or it would
 * reserve phantom width and blow holes in the layout. `.lettering` in
 * globals.css does that; on a machine with real Impact the scale is 1 and this
 * is inert.
 */
export function Lettering({
  children,
  className,
  as,
  ...rest
}: LetteringProps) {
  const Tag = as ?? "span";
  return (
    <Tag className={className} {...rest}>
      <span className="lettering font-display">{children}</span>
    </Tag>
  );
}
