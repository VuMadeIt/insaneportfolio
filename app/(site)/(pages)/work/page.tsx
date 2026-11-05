import { WorkList } from "@/components/WorkList";
import { selected, wins } from "@/content/projects";

export const metadata = {
  title: "Work",
  description: "Everything I've designed and built: case studies, hackathon wins and experiments.",
};

/** The catalogue (PLAN 14.6): hackathon wins, then selected projects. */
export default function WorkPage() {
  return (
    <section
      aria-labelledby="work-title"
      className="px-[var(--gutter)] pb-[clamp(96px,14vh,180px)] pt-[clamp(72px,12vh,140px)]"
    >
      <h1 id="work-title" className="text-[clamp(56px,9vw,148px)] leading-[0.9]">
        All work
      </h1>
      {(
        [
          ["Hackathon wins", wins],
          ["Selected projects", selected],
        ] as const
      ).map(([heading, list]) => (
        <div key={heading} className="mt-[clamp(64px,10vh,120px)]">
          <h2 className="reveal mb-6 text-[clamp(22px,2vw,28px)] leading-[1.2] text-muted">{heading}</h2>
          <WorkList projects={list} level="h3" />
        </div>
      ))}
    </section>
  );
}
