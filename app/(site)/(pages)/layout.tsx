import { Close } from "@/components/Close";
import { BackToSite } from "@/components/SiteNav";

/** Work, About and the case studies: a small way back home, the page, the shared close. */
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="px-[var(--gutter)] pt-[var(--corner-top)]">
        <BackToSite />
      </div>
      <main>{children}</main>
      <Close />
    </>
  );
}
