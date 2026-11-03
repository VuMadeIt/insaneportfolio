import type { Project } from "@/content/projects";

/** A museum tombstone label: title, then year and medium, role, team, one-line credit. */
export function WallLabel({
  project,
  as: Title = "h3",
  className = "",
}: {
  project: Project;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={`text-[15px] leading-[1.5] ${className}`}>
      <Title className="text-[clamp(22px,2vw,28px)] leading-[1.15]">{project.title}</Title>
      <p className="mt-2">
        {project.year}, {project.medium.charAt(0).toLowerCase() + project.medium.slice(1)}
      </p>
      <p>{project.role}</p>
      {project.team && <p className="text-muted">{project.team}</p>}
      {project.credit && <p className="text-muted">{project.credit}</p>}
    </div>
  );
}
