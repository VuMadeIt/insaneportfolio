import { Hero } from "@/components/Hero";
import { BackToSite } from "@/components/SiteNav";

export const metadata = { title: "Not found" };

/** The hero again, still playable, with 404 where the name hangs. */
export default function NotFound() {
  return (
    <main className="relative">
      <Hero name="404" label="404: page not found" corner={<BackToSite label="return to main site" />} />
    </main>
  );
}
