import { StillStage } from "./StillStage";

export const metadata = { title: "Still" };

/** Renders the cradle alone on a transparent page, for `scripts/still.mjs`. */
export default function StillPage() {
  return <StillStage />;
}
