import type { Metadata } from "next";
import { anton, barlowCondensed, courierPrime } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nivish Vincent Raj — Every bug is a suspect.",
  description:
    "Founding CTO. Two companies from zero to one. Real-time systems, AI agents, and CLI tools, shipped raw and then proved.",
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
