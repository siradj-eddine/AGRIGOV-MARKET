"use client";

import type { ApiUser, EditableUserFields } from "@/types/Profile";
import Image from "next/image";
interface Props {
  user:     ApiUser;
  form:     EditableUserFields;
  imageUrl?: string | null;
  onChange: <K extends keyof EditableUserFields>(k: K, v: EditableUserFields[K]) => void;
}

const ROLE_LABELS: Record<string, string> = {
  FARMER:      "Farmer",
  BUYER:       "Buyer",
  TRANSPORTER: "Transporter",
  MINISTRY:    "Ministry Official",
};

const inp =
  "w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm";

export default function PersonalDetailsCard({ user, form, imageUrl, onChange }: Props) {
  const memberYear = new Date(user.created_at).getFullYear();
  const initials   = (form.username || user.username).slice(0, 2).toUpperCase();

  return (
    <section className="md:col-span-8 bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

      {/* Avatar + identity */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border-4 border-white shadow-md">
          {imageUrl ? (
            <Image src={imageUrl} alt="Avatar" width={80} height={80} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-2xl font-black text-primary-dark">{initials}</span>
          )}
        </div>
        <div className="space-y-1.5">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{form.username}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-primary/20 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
            {user.is_verified ? (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                <span className="material-symbols-outlined" style={{ fontSize: "11px", fontVariationSettings: "'FILL' 1" }}>verified</span>
                Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                <span className="material-symbols-outlined" style={{ fontSize: "11px", fontVariationSettings: "'FILL' 1" }}>pending</span>
                Pending Verification
              </span>
            )}
            <span className="text-slate-400 text-xs">Member since {memberYear}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Email</label>
          <input id="email" type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} className={inp} autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="username" className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Username</label>
          <input id="username" type="text" value={form.username} onChange={(e) => onChange("username", e.target.value)} className={inp} autoComplete="username" />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <label htmlFor="phone" className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-symbols-outlined text-base">phone</span>
            </span>
            <input id="phone" type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} className={`${inp} pl-10`} autoComplete="tel" />
          </div>
        </div>
      </div>
    </section>
  );
}