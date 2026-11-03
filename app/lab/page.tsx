import { Hero } from "@/components/Hero";
import { ObjectLab } from "./ObjectLab";

export const metadata = { title: "Object lab" };

export default function ObjectLabPage() {
  return (
    <main>
      <Hero>
        <ObjectLab />
      </Hero>
    </main>
  );
}
