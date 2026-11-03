import { Hero } from "@/components/Hero";

/** Home and the four identity routes share this layout, so the 3D canvas persists between them. */
export default function HeroLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative">
      <Hero />
      {children}
    </main>
  );
}
