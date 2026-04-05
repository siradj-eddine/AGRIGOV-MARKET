"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PersonalDetailsCard from "./PersonalDetailsCard";
import AccountSecurityCard from "./AccountSecurityCard";
import ProfileCompletion   from "./ProfileCompletion";
import { profileApi, ApiError } from "@/lib/api";
import type {
  ApiUser,
  TransporterProfile,
  TransporterExtras,
  EditableUserFields,
  SecuritySetting,
  MissionSummary,
} from "@/types/Profile";
import { DEFAULT_SECURITY_SETTINGS, MISSION_STATUS_STYLES } from "@/types/Profile";

// ── Document images card ──────────────────────────────────────────────────────

function LicenseDocumentsCard({ profile }: { profile: TransporterProfile }) {
  const docs = [
    { key: "driver_license_image", label: "Driver's License", url: profile.driver_license_image },
    { key: "grey_card_image",      label: "Grey Card",         url: profile.grey_card_image      },
  ];

  return (
    <section className="md:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10 space-y-4">
      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>id_card</span>
        Documents
      </h3>
      {docs.map((doc) => (
        <div key={doc.key}>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{doc.label}</p>
          {doc.url ? (
            <div className="relative h-28 w-full rounded-xl overflow-hidden border border-neutral-100 bg-slate-50">
              <Image src={doc.url} alt={doc.label} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
              <div className="absolute top-2 right-2">
                <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <span className="material-symbols-outlined" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>check</span>
                  Uploaded
                </span>
              </div>
            </div>
          ) : (
            <div className="h-28 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 gap-1">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>upload_file</span>
              <p className="text-xs font-medium">Not uploaded yet</p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

// ── Missions panel ────────────────────────────────────────────────────────────

function MyMissions({ missions, isLoading }: { missions: MissionSummary[]; isLoading: boolean }) {
  if (isLoading) return (
    <div className="space-y-3 animate-pulse">
      {[0,1,2].map((i) => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
    </div>
  );
  if (missions.length === 0) return (
    <div className="py-10 text-center text-slate-400">
      <span className="material-symbols-outlined text-4xl block mb-2" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
      <p className="text-sm font-medium">No missions yet.</p>
    </div>
  );
  return (
    <div className="space-y-2.5">
      {missions.slice(0, 5).map((m) => (
        <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{m.order_number}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5 truncate">
              <span className="material-symbols-outlined text-xs">route</span>
              <span className="truncate">{m.pickup} → {m.delivery}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date(m.scheduled_at).toLocaleDateString("en-DZ", { dateStyle: "medium" })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 ml-3 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${MISSION_STATUS_STYLES[m.status]}`}>
              {m.status.replace("_", " ")}
            </span>
            {m.earnings > 0 && (
              <span className="text-xs font-bold text-green-600">+{m.earnings.toLocaleString("fr-DZ")} DZD</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-64 bg-slate-200 rounded-xl" />
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 h-56 bg-slate-100 rounded-xl" />
        <div className="md:col-span-4 h-56 bg-slate-100 rounded-xl" />
        <div className="md:col-span-8 h-40 bg-slate-100 rounded-xl" />
        <div className="md:col-span-4 h-40 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function TransporterProfilePage() {
  const [user,       setUser]      = useState<ApiUser | null>(null);
  const [profile,    setProfile]   = useState<TransporterProfile>({
    age: null, driver_license_image: null, grey_card_image: null,
  });
  const [extras,     setExtras]    = useState<TransporterExtras>({ vehicles_count: 0 });
  const [userForm,   setUserForm]  = useState<EditableUserFields>({ email: "", username: "", phone: "" });
  const [missions,   setMissions]  = useState<MissionSummary[]>([]);
  const [security,   setSecurity]  = useState<SecuritySetting[]>(DEFAULT_SECURITY_SETTINGS);
  const [isLoading,  setIsLoading] = useState(true);
  const [msnLoading, setMsnLoading] = useState(true);
  const [isSaving,   setIsSaving]  = useState(false);
  const [error,      setError]     = useState("");
  const [toast,      setToast]     = useState("");

  useEffect(() => {
    profileApi.me()
      .then((res) => {
        const { user: u, profile: p, extras: e } = (res as any).data;
        setUser(u);
        setUserForm({ email: u.email, username: u.username, phone: u.phone });
        setProfile(p);
        setExtras(e);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load profile."))
      .finally(() => setIsLoading(false));

    profileApi.myMissions().catch(() => ({ results: [] }))
      .then((res) => setMissions(res.results))
      .finally(() => setMsnLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      await profileApi.updateUser(userForm);
      const fd = new FormData();
      if (profile.age !== null) fd.append("age", String(profile.age));
      await profileApi.updateProfile(fd);
      setToast("Profile saved.");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const completedMissions = missions.filter((m) => m.status === "completed").length;
  const totalEarnings     = missions.filter((m) => m.status === "completed").reduce((s, m) => s + m.earnings, 0);

  const completionItems = [
    { label: "Email",          done: !!userForm.email                  },
    { label: "Phone",          done: !!userForm.phone                  },
    { label: "Age",            done: !!profile.age                     },
    { label: "Driver License", done: !!profile.driver_license_image    },
    { label: "Grey Card",      done: !!profile.grey_card_image         },
    { label: "Vehicle Added",  done: extras.vehicles_count > 0         },
    { label: "Verified",       done: user?.is_verified ?? false         },
  ];
  const percent = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  if (isLoading) return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto"><Skeleton /></div>
    </div>
  );

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="px-4 sm:px-6 py-8 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-primary font-bold text-xs tracking-widest uppercase">Transporter Profile</span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">Account Overview</h1>
              <p className="text-sm text-slate-500 mt-1">
                {extras.vehicles_count} vehicle{extras.vehicles_count !== 1 ? "s" : ""} registered
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => user && setUserForm({ email: user.email, username: user.username, phone: user.phone })}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 font-semibold rounded-full hover:bg-slate-200 transition-colors text-sm">
                Discard
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="px-7 py-2.5 bg-primary text-black font-bold rounded-full hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center gap-2 text-sm">
                {isSaving && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
                Save Profile
              </button>
            </div>
          </div>

          {error && <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><span className="material-symbols-outlined text-base">error</span>{error}</div>}
          {toast && <div role="status" aria-live="polite" className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary-dark font-medium"><span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>{toast}</div>}

          {user && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Row 1 */}
              <PersonalDetailsCard user={user} form={userForm} onChange={(k, v) => setUserForm((p) => ({ ...p, [k]: v }))} />

              {/* Driver stats */}
              <section className="md:col-span-4 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10 space-y-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Driver Stats</h3>
                {/* Age */}
                <div className="space-y-1.5">
                  <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Age</label>
                  <input type="number" min={18} value={profile.age ?? ""} onChange={(e) => setProfile((p) => ({ ...p, age: parseInt(e.target.value) }))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                    placeholder="e.g. 35" />
                </div>
                {[
                  { icon: "local_shipping", label: "Missions Done",   value: msnLoading ? "…" : String(completedMissions) },
                  { icon: "payments",       label: "Total Earned",    value: msnLoading ? "…" : `${totalEarnings.toLocaleString("fr-DZ")} DZD` },
                  { icon: "directions_car", label: "Vehicles",        value: String(extras.vehicles_count) },
                  { icon: "verified",       label: "Status",          value: user.is_verified ? "Verified" : "Pending" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="material-symbols-outlined text-primary-dark text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">{s.label}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                    </div>
                  </div>
                ))}
              </section>

              {/* Row 2 — documents */}
              <LicenseDocumentsCard profile={profile} />

              {/* Missions */}
              <section className="md:col-span-8 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                  My Missions
                </h3>
                <MyMissions missions={missions} isLoading={msnLoading} />
              </section>

              {/* Security */}
              <AccountSecurityCard
                settings={security}
                onToggle={(id) => setSecurity((p) => p.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s))}
              />
            </div>
          )}

          <ProfileCompletion percent={percent} items={completionItems} />
        </div>
      </main>
    </div>
  );
}