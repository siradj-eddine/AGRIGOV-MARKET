import { useState } from "react";
import type { AccountFormState, RegisterRole } from "@/types/Register";
import { ROLE_LABELS, ROLE_ICONS } from "@/types/Register";

interface Props {
  role: RegisterRole;
  form: AccountFormState;
  onChange: <K extends keyof AccountFormState>(key: K, val: AccountFormState[K]) => void;
}

const field =
  "block w-full py-2.5 px-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-primary focus:outline-none text-sm transition";

export default function AccountStep({ role, form, onChange }: Props) {
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirm]   = useState(false);

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Information</h3>
        <p className="text-gray-500">Enter your details to create your account.</p>
      </div>

      {/* Role badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary-dark">
        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
          {ROLE_ICONS[role]}
        </span>
        Registering as: {ROLE_LABELS[role]}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@example.com"
            className={field}
            autoComplete="email"
          />
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            type="text"
            value={form.username}
            onChange={(e) => onChange("username", e.target.value)}
            placeholder="your_username"
            className={field}
            autoComplete="username"
          />
        </div>

        {/* Phone — full width */}
        <div className="md:col-span-2 space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <span className="material-symbols-outlined text-lg">phone</span>
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="0550 000 000"
              className={`${field} pl-10`}
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Min. 8 characters"
              className={`${field} pr-10`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              placeholder="Repeat your password"
              className={`${field} pr-10 ${passwordMismatch ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-xl">
                {showConfirmPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
          {passwordMismatch && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              Passwords do not match
            </p>
          )}
        </div>
      </div>
    </div>
  );
}