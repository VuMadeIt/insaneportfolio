import { HeroCorners, HeroName } from "./HeroChrome";
import { HeroStage } from "./HeroStage";
import { SoundToggle } from "./SoundToggle";
import { StoryController } from "./StoryController";

/** The hero: corner lines, the giant name, the cradle. Lives in the (hero) layout, never remounts. */
export function Hero() {
  return (
    <section aria-label="Lucas Vu" className="relative h-dvh min-h-[560px] w-full overflow-hidden bg-wall">
      <HeroName />
      <div className="hero-frame absolute inset-0">
        <HeroStage />
      </div>
      <HeroCorners />
      <SoundToggle className="absolute bottom-[calc(30.5vw*0.86)] right-[var(--gutter)]" />
      <StoryController />
    </section>
  );
}
