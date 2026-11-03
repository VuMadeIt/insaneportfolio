import Link from "next/link";
import { Hero } from "@/components/Hero";

export const metadata = { title: "Not found" };

/** The hero again, still playable, with 404 where the name hangs. */
export default function NotFound() {
  return (
    <main className="relative">
      <Hero
        name="404"
        label="404: page not found"
        corner={
          <Link href="/" className="back-link u-grow text-[16px]">
            <span aria-hidden>&larr;</span> return to main site
          </Link>
        }
      />
    </main>
  );
}
