import Link from "next/link";
import { Footer } from "@/components/Footer";
import { HomeAbout } from "@/components/HomeAbout";
import { WorkList } from "@/components/WorkList";
import { homeProjects } from "@/content/projects";

/** Under the hero: the two strongest projects, a way to the rest, the about teaser, the ball-pit footer. */
export default function HomePage() {
  return (
    <>
      <section
        id="work"
        aria-labelledby="work-title"
        className="px-[var(--gutter)] pb-[clamp(72px,10vh,120px)] pt-[clamp(96px,16vh,180px)]"
      >
        <h2 id="work-title" className="sr-only">
          Selected work
        </h2>
        <WorkList projects={homeProjects} level="h3" />
        <Link href="/work" className="link-arrow reveal mt-12 inline-block text-[clamp(22px,2.2vw,30px)]">
          View more work <span aria-hidden>&rarr;</span>
        </Link>
      </section>
      <HomeAbout />
      <Footer physics />
    </>
  );
}
