import { Close } from "@/components/Close";
import { SiteNav } from "@/components/SiteNav";

/** Work, About and the case studies: the slim top line, the page, the shared close. */
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <Close />
    </>
  );
}
