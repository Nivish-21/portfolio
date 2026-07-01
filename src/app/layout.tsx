import type { Metadata } from "next";
import { sairaCondensed, saira, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nivish Vincent Raj — Ship first. Scale later.",
  description:
    "Founding CTO building real-time systems, AI agents, and CLI tools — with the same marginal-gains discipline he brings to running, the gym, and chess.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sairaCondensed.variable} ${saira.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}
