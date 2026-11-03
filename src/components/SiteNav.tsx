import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "./Close";

/** about, work and the `say hi` pill (old NavBar.jsx): metal underlines that draw in on hover. */
export function NavLinks() {
  return (
    <div className="flex items-center gap-6 text-[16px] sm:gap-7 sm:text-[17px]">
      <Link href="/about" className="u-grow">
        about
      </Link>
      <Link href="/work" className="u-grow">
        work
      </Link>
      <a
        href={`mailto:${CONTACT.email}`}
        className="group rounded-full bg-ink px-5 py-2 text-wall transition-colors duration-300 hover:bg-[#2a2a2a]"
      >
        <span className="u-grow group-hover:bg-[length:100%_0.1em]">say hi</span>
      </a>
    </div>
  );
}

/**
 * Inner pages: the old site's bar, fixed, with the "i am vu" logo on the left. It slides down on
 * load; the home hero has its own links-only version (HeroChrome).
 */
export function SiteNav() {
  return (
    <>
      <nav
        aria-label="Site"
        className="nav-in fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-wall px-[var(--gutter)] py-4"
      >
        <Link href="/" aria-label="Lucas Vu, home" className="shrink-0">
          <Image
            src="/logo.png"
            alt="i am vu"
            width={1073}
            height={314}
            className="h-7 w-auto sm:h-8"
            priority
          />
        </Link>
        <NavLinks />
      </nav>
      <div aria-hidden className="h-[72px] sm:h-[80px]" />
    </>
  );
}
