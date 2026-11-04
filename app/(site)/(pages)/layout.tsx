import { Footer } from "@/components/Footer";

/** Work, About and the case studies: the page under the fixed nav, then the footer. */
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="pt-[var(--nav-h)]">{children}</main>
      <Footer />
    </>
  );
}
