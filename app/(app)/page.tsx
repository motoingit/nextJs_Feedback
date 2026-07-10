'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Mail, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import messages from '@/public/message.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/shadcn/carousel';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950 text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 md:px-8 py-20 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto z-10">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-72 h-72 md:w-96 md:h-96 rounded-full bg-primary/10 blur-3xl" />

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-6">
          Get Honest, Real Feedback <br />
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Completely Anonymously</span>
        </h1>

        <p className="max-w-2xl text-base md:text-xl text-muted-foreground mb-8 leading-relaxed">
          True Feedback is the easiest way to receive constructive, anonymous messages from your friends, coworkers, or social media followers.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {session ? (
            <Link href="/dashboard">
              <Button size="lg" className="shadow-lg hover:shadow-primary/20 transition-all duration-300">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up">
                <Button size="lg" className="shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Messages Carousel Section */}
      <section className="px-4 md:px-8 py-12 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-8 tracking-tight">
          What people are whispering:
        </h2>
        
        <Carousel className="w-full max-w-lg md:max-w-xl mx-auto">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-2">
                <Card className="border border-border/40 bg-card/60 backdrop-blur-sm shadow-md rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="p-0 pb-3 flex flex-row items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{message.title}</CardTitle>
                      <CardDescription className="text-xs">{message.received}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-medium italic">
                      &ldquo;{message.content}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Feature grid */}
      <section className="px-6 md:px-12 py-16 bg-slate-100/50 dark:bg-slate-900/30 border-y border-border/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start p-6 bg-card border border-border/40 rounded-2xl shadow-sm">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl mb-4">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">100% Secure & Private</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We take privacy seriously. Your profile and link are secure, and sender data is never tracked or logged.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 bg-card border border-border/40 rounded-2xl shadow-sm">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl mb-4">
              <MessageSquare className="size-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Clean User Dashboard</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Easily toggle whether you are accepting messages, view list cards of recent whispers, or delete spam with one click.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 bg-card border border-border/40 rounded-2xl shadow-sm">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl mb-4">
              <Zap className="size-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Interactive AI Prompts</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Can&apos;t think of what to ask? Use our built-in Gemini AI prompts to generate engaging questions instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 border-t border-border/30 bg-card text-muted-foreground text-xs md:text-sm">
        &copy; {new Date().getFullYear()} True Feedback. All rights reserved. Built with passion and privacy.
      </footer>
    </div>
  );
}
