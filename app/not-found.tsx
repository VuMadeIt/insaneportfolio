import { Hero } from "@/components/Hero";

export const metadata = { title: "Not found" };

/** The hero again, still playable, with 404 where the name hangs. */
export default function NotFound() {
  return (
    <main className="relative">
      <Hero name="404" label="404: page not found" />
    </main>
  );
}
