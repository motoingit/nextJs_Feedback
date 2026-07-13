import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/components/shadcn/sonner";
import AuthProvider from "../context/AuthProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/shadUtil";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "True Feedback",
  description: "Real feedback from real people.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <AuthProvider>
        <body className="font-sans antialiased bg-slate-50 dark:bg-slate-950">
          {children}
          <Toaster richColors position="top-center" />
        </body>
      </AuthProvider>
    </html>
  );
}
