# The Case Files

My portfolio, built as a detective's case files. Every project is a case, every
bug is a suspect, and every fix is a deduction.

**Live: [nivish.vercel.app](https://nivish.vercel.app)**

## Why it looks like this

The previous version was an F1 telemetry dashboard. People told me it looked
AI-generated, and they were right, but not for the reason I first assumed. The
problem was never the theme. It was the skeleton underneath it: sticky nav, hero,
a section heading with a rule under it, a grid of identical cards, a grid of
identical tiles, a form, a footer. That is the shape almost every generated page
comes out in, and no amount of livery painted on top changes what it is.

So this version does not paint a theme onto that skeleton. The theme _is_ the
interface.

- **Cases are shut when you arrive.** Hovering one surfaces the suspects, struck
  out, each with the reason it was eliminated. Opening one names the culprit, the
  fix, and where the proof is. A case that shows you its answer on arrival is not
  a case.
- **Four of the eight cases are sealed.** Three are a client's system and one is a
  stealth company, so there is genuinely no repository to link. The site stamps
  those shut and says so, rather than quietly leaving the link off and hoping
  nobody notices which cases have one.
- **The evidence board pins each tool to the case it cracked**, not to a
  frequency. "OSRM, the fare that lied" is a claim you can go and check. "Python,
  daily" is not.
- **Every credential links to the issuer's own verification page.** An
  unverifiable claim on a portfolio is decoration.

## Notes for anyone reading the source

**The display face is Impact, and it is not self-hosted.** Impact is
Monotype-licensed and ships with Windows and macOS, so it cannot be
redistributed. It does not need to be: `globals.css` declares a `@font-face` with
only `local()` sources, so every Mac and PC uses the copy already installed and
downloads nothing. Where Impact is genuinely absent, the stack falls through to
Anton.

Anton is 28.6% wider than Impact at the same size (measured: `NIVISH VINCENT RAJ`
at 100px is 779px in Impact and 1002px in Anton). That width gap is why every free
substitute reads wrong and why it is hard to say why. So a script in `layout.tsx`
checks for Impact before first paint and, if it is missing, squeezes the fallback
back to Impact's own width. That squeeze is a `transform`, and a transform does
not resize the layout box, which is the whole reason `Lettering.tsx` exists: the
scaled text has to be an inline-block that hugs its own glyphs.

**Contrast was measured, not eyeballed.** The recessive greys and the red carry
their ratios as comments in `globals.css`. The red used for the thread, the pins
and the wax seal fails AA at body sizes, so a lighter variant carries small red
text.

## Running it

```bash
npm install
npm run dev
```

`RESEND_API_KEY` is needed for the contact form to deliver. Without it the form
returns an honest error rather than pretending to have sent something. See
`.env.example`.

## Stack

Next.js (App Router) · TypeScript · Tailwind · Resend · Vercel
