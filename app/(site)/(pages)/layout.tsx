import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

/** Work, About and the case studies: the site nav, the page, the shared footer. */
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
