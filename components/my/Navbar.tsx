"use client"

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { User } from 'next-auth';
import { Button } from '@/components/shadcn/button';

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-3.5">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Branding Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent hover:opacity-95 transition-opacity">
            True Feedback
          </span>
        </Link>

        {/* User Navigation / CTA Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="hidden sm:inline-block text-sm font-medium text-muted-foreground">
                Welcome, <span className="font-semibold text-foreground">{user?.username || user?.email}</span>
              </span>
              <Link href="/dashboard">
                <Button variant="ghost" size="xs">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="xs" 
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button size="xs" variant="default">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
