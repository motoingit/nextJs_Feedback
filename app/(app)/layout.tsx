import Navbar from '@/components/my/Navbar';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | True Feedback',
  description: 'Manage your anonymous feedback inbox, toggle status, and view suggested prompts.',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
    </div>
  );
}
