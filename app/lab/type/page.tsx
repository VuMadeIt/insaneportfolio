import { Fraunces, Roboto_Flex } from "next/font/google";
import HomePage from "../../(site)/(hero)/page";
import { Hero } from "@/components/Hero";
import { TypeSwitcher } from "./TypeSwitcher";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  preload: false,
});
const flex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--font-flex-lab",
  preload: false,
});

export const metadata = { title: "Type lab" };

/** The home page with a typeface switcher (PLAN 15.8). */
export default async function TypeLabPage({ searchParams }: { searchParams: Promise<{ font?: string }> }) {
  const { font } = await searchParams;
  return (
    <main className="relative">
      <TypeSwitcher variables={`${fraunces.variable} ${flex.variable}`} initial={font} />
      <Hero />
      <HomePage />
    </main>
  );
}
