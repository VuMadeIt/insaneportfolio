import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryPanel } from "@/components/StoryPanel";
import { identities } from "@/content/identities";

export const dynamicParams = false;

export function generateStaticParams() {
  return identities.map((i) => ({ identity: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ identity: string }>;
}): Promise<Metadata> {
  const { identity: slug } = await params;
  const identity = identities.find((i) => i.slug === slug);
  if (!identity) return {};
  const description = `${identity.line} ${identity.sentences[0]}`;
  return {
    title: identity.title,
    description,
    openGraph: { title: `${identity.title} | Lucas Vu`, description },
    alternates: { canonical: `/${identity.slug}` },
  };
}

export default async function IdentityPage({ params }: { params: Promise<{ identity: string }> }) {
  const { identity: slug } = await params;
  const identity = identities.find((i) => i.slug === slug);
  if (!identity) notFound();
  return <StoryPanel identity={identity} />;
}
