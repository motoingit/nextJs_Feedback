import Navbar from "@/components/my/Navbar";
import React from "react";

export default function InputMessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow flex flex-col">{children}</main>
    </div>
  );
}
