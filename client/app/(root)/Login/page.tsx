import type { Metadata } from "next";
import BackgroundDecoration from "@/components/Auth/Background";
import LoginHero from "@/components/Auth/LoginHero";
import LoginForm from "@/components/Auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — AgriConnect",
  description: "Sign in to Algeria's official national agricultural platform.",
};

export default function LoginPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex items-center justify-center p-4 antialiased selection:bg-primary selection:text-black transition-colors duration-300">
      <BackgroundDecoration />
      <main className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <LoginHero />
        <LoginForm />
      </main>
    </div>
  );
}