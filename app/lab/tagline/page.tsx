import HomePage from "../../(site)/(hero)/page";
import { TaglineEditions } from "./TaglineEditions";

export const metadata = { title: "Tagline lab" };

/** The home page with the tagline in each place it could go (PLAN 15.12). */
export default async function TaglineLabPage({ searchParams }: { searchParams: Promise<{ at?: string }> }) {
  const { at } = await searchParams;
  return (
    <main className="relative">
      <TaglineEditions initial={at}>
        <HomePage />
      </TaglineEditions>
    </main>
  );
}
