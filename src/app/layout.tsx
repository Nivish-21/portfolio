import type { Metadata } from "next";
import { anton, barlowCondensed, courierPrime } from "@/lib/fonts";
import "./globals.css";

const TITLE = "Nivish Vincent Raj — Every bug is a suspect.";
const DESCRIPTION =
  "Founding CTO. Two companies from zero to one. Every project here is a case: the crime, the suspects I ruled out, and the culprit that survived.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nivish.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  // Without these the link previews as a blank card wherever it is shared, which
  // is most of the places a portfolio actually gets passed around.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://nivish.vercel.app",
    siteName: "Nivish Vincent Raj",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  authors: [
    { name: "Nivish Vincent Raj", url: "https://github.com/Nivish-21" },
  ],
};

/**
 * Runs before first paint. If the visitor's machine has no Impact we mark the
 * document so the CSS can squeeze the Anton fallback back to Impact's width.
 * Inline and synchronous on purpose: doing this in an effect would show a flash
 * of over-wide lettering first.
 */
const IMPACT_CHECK = `try{if(!document.fonts.check('16px Impact'))document.documentElement.classList.add('no-impact')}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${barlowCondensed.variable} ${courierPrime.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: IMPACT_CHECK }} />
      </head>
      <body className="min-h-full flex flex-col bg-void text-file">
        {children}
      </body>
    </html>
  );
}
