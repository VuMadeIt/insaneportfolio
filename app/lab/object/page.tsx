import { ObjectStage } from "./ObjectStage";

export const metadata = { title: "Object" };

/** One object on a transparent page (`?o=balls|ball|gold|bronze|cash|airpods`), for `scripts/objects.mjs`. */
export default function ObjectPage() {
  return <ObjectStage />;
}
