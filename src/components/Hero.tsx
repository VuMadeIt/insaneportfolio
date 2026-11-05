import { HeroName } from "./HeroChrome";
import { HeroStage } from "./HeroStage";
import { StoryController } from "./StoryController";
import { HOME_PLACEMENT, type Placement } from "./Tagline";

/** The hero: the cradle and the giant name. Lives in the (hero) layout, never remounts. */
export function Hero({
  name,
  label,
  tagline = name ? undefined : HOME_PLACEMENT,
}: {
  /** The 404 swaps the name for "404" (and drops the tagline). */
  name?: string;
  label?: string;
  /** Where the tagline sits; "below" is drawn by the page under the hero. */
  tagline?: Placement;
}) {
  return (
    <section aria-label="Lucas Vu" className="relative h-dvh min-h-[560px] w-full overflow-hidden bg-wall">
      <HeroName text={name} label={label} tagline={tagline} />
      <div className="hero-frame absolute inset-0">
        <HeroStage />
      </div>
      <StoryController />
    </section>
  );
}
