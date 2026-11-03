import { WorkList } from "@/components/WorkList";
import { allProjects } from "@/content/projects";

export const metadata = {
  title: "Work",
  description: "Everything Lucas Vu has designed and built: case studies, hackathon wins, experiments.",
};

/** The catalogue: the three strongest first, then everything else, newest first. */
export default function WorkPage() {
  return (
    <section
      aria-labelledby="work-title"
      className="px-[var(--gutter)] pb-[clamp(96px,14vh,180px)] pt-[clamp(72px,12vh,140px)]"
    >
      <h1 id="work-title" className="text-[clamp(56px,9vw,148px)] leading-[0.9]">
        All work
      </h1>
      <p className="mt-8 max-w-[32em] text-[clamp(19px,1.6vw,23px)] leading-[1.5]">
        Case studies, hackathon wins and things I made to find out. My three favourites first, then everything
        else, newest first.
      </p>
      <div className="mt-16">
        <WorkList projects={allProjects} />
      </div>
    </section>
  );
}
