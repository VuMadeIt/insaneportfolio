import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="flex min-h-[80dvh] flex-col justify-center px-[var(--gutter)]">
        <h1 className="text-[clamp(48px,7vw,112px)] leading-[0.95]">Nothing hangs here.</h1>
        <p className="mt-6 max-w-[30em] text-[18px]">
          This page has swung out of reach. The cradle is still where you left it.
        </p>
        <Link href="/" className="link-arrow mt-8 text-[18px]">
          Back to the cradle <span aria-hidden>&rarr;</span>
        </Link>
      </main>
    </>
  );
}
