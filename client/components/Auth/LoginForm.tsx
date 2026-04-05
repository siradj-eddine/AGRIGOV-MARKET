"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { ROLE_DASHBOARD } from "@/types/Auth";
import type { LoginPayload } from "@/types/Auth";

// ─── Friendly HTTP error messages ─────────────────────────────────────────────

function friendlyError(status: number, msg: string): string {
  if (status === 401 || status === 400) return "Incorrect email/phone or password.";
  if (status === 403) return msg.toLowerCase().includes("verif")
    ? "Your account is not yet verified. Check your email."
    : "Your account has been suspended. Contact support.";
  if (status === 429) return "Too many attempts. Please wait a few minutes.";
  if (status >= 500)  return "Server error. Please try again shortly.";
  return msg || "Something went wrong.";
}

export default function LoginForm() {
  const router = useRouter();

  const [identity, setIdentity]       = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState("");

  const canSubmit = identity.trim().length > 0 && password.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await apiFetch<{ data: LoginPayload }>("/api/users/auth/login/", {
        method: "POST",
        body: JSON.stringify({ email: identity.trim(), password }),
      });

      const { access, refresh, user } = res.data;

      document.cookie = `access=${access}; path=/`;
      document.cookie = `refresh=${refresh}; path=/`;
      document.cookie = `role=${user.role}; path=/`;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      router.push(ROLE_DASHBOARD[user.role] ?? "/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(friendlyError(err.status, err.message));
      } else {
        setError("Unable to connect. Check your internet connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `block w-full py-2.5 pl-10 pr-3 rounded-lg border text-sm bg-white dark:bg-slate-800
     text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2
     transition duration-150 ${
       hasError
         ? "border-red-400 focus:ring-red-400"
         : "border-slate-300 dark:border-slate-600 focus:ring-primary focus:border-primary"
     }`;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 relative overflow-hidden">

        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary to-green-600" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4">
            <span
              className="material-symbols-outlined text-4xl text-green-700 dark:text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              agriculture
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400"
          >
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            {error}
          </div>
        )}

        <div className="space-y-5">

          {/* Identity */}
          <div>
            <label htmlFor="identity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email or Phone Number
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                person
              </span>
              <input
                id="identity"
                type="text"
                inputMode="email"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="farmer@agri.gov or 0550000000"
                className={inputClass(!!error)}
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-sm font-medium text-green-700 dark:text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter your password"
                className={`${inputClass(!!error)} pr-10`}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                <span className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xl transition-colors">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !canSubmit}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-bold text-black bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                Signing In…
              </>
            ) : (
              "Secure Sign In"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">First time here?</span>
          </div>
        </div>

        {/* Register */}
        <Link
          href="/Register"
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 w-full transition-colors"
        >
          <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            app_registration
          </span>
          Register New Account
        </Link>

        {/* Trust badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-slate-400 text-sm">verified_user</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Secured by Ministry of Agriculture IT
          </span>
        </div>
      </div>

      <p className="lg:hidden text-center text-xs text-slate-400 mt-6">
        © {new Date().getFullYear()} National Agricultural Platform. All rights reserved.
      </p>
    </div>
  );
}