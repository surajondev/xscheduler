"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isAuthenticated, checkAuth } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center font-sans sm:p-20">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to XScheduler
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          The professional Twitter/X scheduling and management dashboard
          designed to streamline your social media workflow.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Register
            </Button>
          </Link>
        </div>
      </main>
      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} XScheduler. All rights reserved.
      </footer>
    </div>
  );
}
