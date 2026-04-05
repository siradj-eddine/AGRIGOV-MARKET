"use client";

import { useState } from "react";
import type { SecuritySetting, ChangePasswordFields } from "@/types/Profile";
import { profileApi, ApiError } from "@/lib/api";

interface Props {
  settings:  SecuritySetting[];
  onToggle:  (id: string) => void;
}

const inp =
  "w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm";

export default function AccountSecurityCard({ settings, onToggle }: Props) {
  const [showModal,  setShowModal]  = useState(false);
  const [fields,     setFields]     = useState<ChangePasswordFields>({
    current_password: "", new_password: "", confirm_password: "",
  });
  const [showPw,     setShowPw]     = useState({ current: false, new: false, confirm: false });
  const [isLoading,  setIsLoading]  = useState(false);
  const [feedback,   setFeedback]   = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const set = <K extends keyof ChangePasswordFields>(k: K, v: string) =>
    setFields((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (fields.new_password !== fields.confirm_password) {
      setFeedback({ type: "error", msg: "New passwords do not match." });
      return;
    }
    if (fields.new_password.length < 8) {
      setFeedback({ type: "error", msg: "New password must be at least 8 characters." });
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      await profileApi.changePassword(fields);
      setFeedback({ type: "success", msg: "Password changed successfully." });
      setTimeout(() => { setShowModal(false); setFields({ current_password: "", new_password: "", confirm_password: "" }); setFeedback(null); }, 1800);
    } catch (err) {
      setFeedback({
        type: "error",
        msg: err instanceof ApiError ? err.message : "Failed to change password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="md:col-span-6 bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">Account Security</h3>
          <span className="material-symbols-outlined text-slate-400">shield_lock</span>
        </div>

        <div className="space-y-6">
          {settings.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
              </div>
              {s.type === "toggle" ? (
                <button
                  role="switch"
                  aria-checked={s.enabled}
                  aria-label={`Toggle ${s.label}`}
                  onClick={() => onToggle(s.id)}
                  className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${s.enabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${s.enabled ? "right-1" : "left-1"}`} />
                </button>
              ) : (
                <button className="text-primary text-xs font-bold uppercase hover:underline shrink-0">
                  {s.linkLabel}
                </button>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-neutral-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">key</span>
              Change Password
            </button>
            <button className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm font-bold text-red-600 flex items-center justify-center gap-2 border border-red-200 hover:bg-red-100 transition-colors">
              <span className="material-symbols-outlined text-sm">no_accounts</span>
              Deactivate
            </button>
          </div>
        </div>
      </section>

      {/* ── Change password modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Change Password</h3>
              <button onClick={() => { setShowModal(false); setFeedback(null); }} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {feedback && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {feedback.type === "success" ? "check_circle" : "error"}
                </span>
                {feedback.msg}
              </div>
            )}

            {(["current_password", "new_password", "confirm_password"] as const).map((key) => {
              const labels: Record<typeof key, string> = {
                current_password: "Current Password",
                new_password:     "New Password",
                confirm_password: "Confirm New Password",
              };
              const show = key === "current_password" ? showPw.current
                         : key === "new_password"     ? showPw.new
                         :                              showPw.confirm;
              const toggle = () => setShowPw((p) => ({
                ...p,
                [key === "current_password" ? "current" : key === "new_password" ? "new" : "confirm"]: !show,
              }));
              return (
                <div key={key} className="space-y-1.5">
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider">
                    {labels[key]}
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={fields[key]}
                      onChange={(e) => set(key, e.target.value)}
                      className={`${inp} pr-10`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined text-base">
                        {show ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setShowModal(false); setFeedback(null); }}
                className="flex-1 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !fields.current_password || !fields.new_password}
                className="flex-1 py-3 bg-primary hover:bg-primary-dark text-black rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                ) : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}