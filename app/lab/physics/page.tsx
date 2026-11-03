import analysis from "../../../reference/audio/analysis.json";
import { PhysicsLab } from "./PhysicsLab";

export const metadata = { title: "Physics lab" };

export default function PhysicsLabPage() {
  const recording = analysis.find((a) => a.file.endsWith("131596_1554038.mp3"))!;
  return <PhysicsLab recordingOnsets={recording.onsets} />;
}
