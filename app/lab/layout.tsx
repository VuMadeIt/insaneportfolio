import { notFound } from "next/navigation";

export const metadata = { title: "Lab", robots: { index: false } };

/** The comparison lab is a development tool: 404 in production unless built with LAB=1. */
export default function LabLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production" && process.env.LAB !== "1") notFound();
  return children;
}
