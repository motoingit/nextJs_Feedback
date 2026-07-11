import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Send Feedback to @${username} | True Feedback`,
    description: `Send anonymous feedback, questions, or comments to @${username} on True Feedback.`,
  };
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
