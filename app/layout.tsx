import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Cursor } from "@/components/Cursor";
import { ScrollMotion } from "@/components/ScrollMotion";
import { SiteNav } from "@/components/SiteNav";
import "lenis/dist/lenis.css";
import "./globals.css";

// Official Fontshare woff2 files, served unmodified (ITF FFL forbids subsetting or conversion).
const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Variable.woff2", weight: "200 700", style: "normal" },
    { path: "./fonts/GeneralSans-VariableItalic.woff2", weight: "200 700", style: "italic" },
  ],
  variable: "--font-general",
  display: "swap",
});
const cabinetGrotesk = localFont({
  src: "./fonts/CabinetGrotesk-Variable.woff2",
  weight: "100 900",
  variable: "--font-cabinet",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Lucas Vu", template: "%s | Lucas Vu" },
  description: "Lucas Vu is a product designer who gets things moving.",
};

export const viewport: Viewport = { themeColor: "#f7f0df" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${generalSans.variable} ${cabinetGrotesk.variable}`}>
      <body>
        <SiteNav />
        {children}
        <ScrollMotion />
        <Cursor />
      </body>
    </html>
  );
}
