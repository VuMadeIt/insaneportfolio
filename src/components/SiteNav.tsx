import Link from "next/link";
import { CONTACT } from "./Close";

/** Inner pages: one slim line, a back arrow home on the left, Work, About, Email on the right. */
export function SiteNav() {
  return (
    <nav
      aria-label="Site"
      className="flex items-baseline justify-between px-[var(--gutter)] pt-[var(--corner-top)] text-[16px]"
    >
      <Link href="/" className="group">
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-x-1"
        >
          &larr;
        </span>{" "}
        Lucas Vu
      </Link>
      <div className="flex gap-6">
        <Link href="/work" className="hover:text-muted">
          Work
        </Link>
        <Link href="/about" className="hover:text-muted">
          About
        </Link>
        <a href={`mailto:${CONTACT.email}`} className="hover:text-muted">
          Email
        </a>
      </div>
    </nav>
  );
}
