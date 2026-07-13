import { Anton, Barlow_Condensed, Courier_Prime } from "next/font/google";

/**
 * Display face. The site is lettered in Impact, which cannot be self-hosted
 * (Monotype licence, bundled with Windows/macOS). It does not need to be: a
 * `local()` source in globals.css uses the copy already on the visitor's
 * machine, and only falls through to Anton when Impact is genuinely absent
 * (Android, Linux).
 *
 * Anton is 28.6% wider than Impact at the same size, so the fallback is
 * squeezed back to Impact's width. See `.no-impact` in globals.css and
 * docs/decisions.md (2026-07-13).
 */
export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

/** Narration and body copy. Condensed, to sit under the display lettering. */
export const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** The typed voice: case metadata, testimony documents, the redaction bars. */
export const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});
