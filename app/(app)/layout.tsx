import Navbar from '@/components/my/Navbar';
import AuthProvider from '@/context/AuthProvider';
import { Metadata } from 'next';
import React from 'react';
import { Toaster } from 'sonner';

// configiration
export const metadata: Metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};

/**
 * Shared layout wrapper for all application pages (e.g. Home, Dashboard).
 * Add any shared Navbars, Sidebars, or Footers here.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <body>
          <Navbar/>
          <div className="min-h-screen bg-background">
            {children}
          </div>
          <Toaster />
        </body>
  );
}
