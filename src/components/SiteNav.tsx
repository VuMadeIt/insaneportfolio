import Link from "next/link";

/** Inner pages: no nav bar, only a small arrow back to the home page. */
export function BackToSite({ label = "Back to Site" }: { label?: string }) {
  return (
    <Link href="/" className="back-link u-grow pointer-events-auto text-[16px]">
      <span aria-hidden>&larr;</span> {label}
    </Link>
  );
}
