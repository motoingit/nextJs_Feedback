import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Account | True Feedback",
  description: "Verify your email verification code to activate your True Feedback account.",
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
