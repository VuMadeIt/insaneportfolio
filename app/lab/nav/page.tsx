import HomePage from "../../(site)/(hero)/page";
import { Hero } from "@/components/Hero";
import { NavEditions } from "./NavEditions";

export const metadata = { title: "Nav lab" };

/** The home page under each nav edition, to compare (PLAN 15.7). */
export default async function NavLabPage({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const { v } = await searchParams;
  return (
    <main className="relative">
      <NavEditions initial={v} />
      <Hero />
      <HomePage />
    </main>
  );
}
