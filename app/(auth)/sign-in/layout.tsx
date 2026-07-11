import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | True Feedback",
  description: "Sign in to your True Feedback account to manage your anonymous message inbox.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
