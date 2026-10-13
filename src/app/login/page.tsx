import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/navigation/Logo";
import { LoginForm } from "@/components/portal/login/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-center gap-8 bg-lilac px-4 py-16">
      <div aria-hidden className="grid-lines-light absolute inset-0" />
      <div className="relative">
        <Logo tone="light" />
      </div>
      <div className="relative flex w-full justify-center">
        <Suspense fallback={<div className="h-96 w-full max-w-sm rounded-[2rem] border border-line bg-white" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
