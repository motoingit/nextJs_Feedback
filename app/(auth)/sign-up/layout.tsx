import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | True Feedback",
  description: "Create a True Feedback account and start receiving anonymous questions from your audience.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
