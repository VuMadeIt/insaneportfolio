import HomePage from "../../(site)/(hero)/page";
import { Hero } from "@/components/Hero";
import { HavenMenu } from "./HavenMenu";

export const metadata = { title: "Nav lab" };

/** The home page with the Haven-style menu in place of the site nav, to compare (PLAN 15.7). */
export default function NavLabPage() {
  return (
    <main className="relative">
      <HavenMenu />
      <Hero />
      <HomePage />
    </main>
  );
}
