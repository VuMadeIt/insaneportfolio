import { HeroCorners, HeroName } from "./HeroChrome";
import { HeroStage } from "./HeroStage";
import { StoryController } from "./StoryController";

/** The hero: the cradle and the giant name. Lives in the (hero) layout, never remounts. */
export function Hero({
  name,
  label,
  corner,
}: {
  /** The 404 swaps the name for "404" and adds its own link. */
  name?: string;
  label?: string;
  corner?: React.ReactNode;
}) {
  return (
    <section aria-label="Lucas Vu" className="relative h-dvh min-h-[560px] w-full overflow-hidden bg-wall">
      <HeroName text={name} label={label} />
      <div className="hero-frame absolute inset-0">
        <HeroStage />
      </div>
      <HeroCorners>{corner}</HeroCorners>
      <StoryController />
    </section>
  );
}
