"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PersonalDetailsCard from "./PersonalDetailsCard";
import ProfileCompletion   from "./ProfileCompletion";
import { profileApi, ApiError } from "@/lib/api";
import type {
  ApiUser,
  FarmerProfile,
  FarmerExtras,
  EditableUserFields,
  SecuritySetting,
} from "@/types/Profile";
import { DEFAULT_SECURITY_SETTINGS } from "@/types/Profile";

// ── Wilayas list (same as registration) ─────────────────────────────────────
const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar",
  "Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger",
  "Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma",
  "Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","El Bayadh",
  "Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued",
  "Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent",
  "Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal","Béni Abbès",
  "In Salah","In Guezzam","Touggourt","Djanet","El M'Ghair","El Meniaa",
];

// ── Farm details form ────────────────────────────────────────────────────────

function FarmDetailsCard({
  profile,
  onChange,
}: {
  profile:  FarmerProfile;
  onChange: <K extends keyof FarmerProfile>(k: K, v: FarmerProfile[K]) => void;
}) {
  const inp = "w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm";

  return (
    <section className="md:col-span-8 bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10">
      <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>agriculture</span>
        Farm Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Wilaya */}
        <div className="space-y-1.5">
          <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Wilaya</label>
          <div className="relative">
            <select value={profile.wilaya} onChange={(e) => onChange("wilaya", e.target.value)}
              className={`${inp} appearance-none pr-8`}>
              <option value="">Select Wilaya</option>
              {WILAYAS.map((w) => <option key={w}>{w}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <span className="material-symbols-outlined text-base">expand_more</span>
            </span>
          </div>
        </div>

        {/* Baladiya */}
        <div className="space-y-1.5">
          <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Baladiya</label>
          <input type="text" value={profile.baladiya} onChange={(e) => onChange("baladiya", e.target.value)} className={inp} placeholder="e.g. Bab Ezzouar" />
        </div>

        {/* Farm size */}
        <div className="space-y-1.5">
          <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Farm Size (ha)</label>
          <input type="number" min={0} step={0.1} value={profile.farm_size ?? ""} onChange={(e) => onChange("farm_size", parseFloat(e.target.value))} className={inp} placeholder="e.g. 5.5" />
        </div>

        {/* Age */}
        <div className="space-y-1.5">
          <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Age</label>
          <input type="number" min={18} value={profile.age ?? ""} onChange={(e) => onChange("age", parseInt(e.target.value))} className={inp} placeholder="e.g. 35" />
        </div>

        {/* Address */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Address</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-symbols-outlined text-base">place</span>
            </span>
            <input type="text" value={profile.address} onChange={(e) => onChange("address", e.target.value)} className={`${inp} pl-10`} placeholder="Street, landmark…" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Document images sidebar ──────────────────────────────────────────────────

function DocumentsCard({ profile }: { profile: FarmerProfile }) {
  const docs = [
    { key: "farmer_card_image",  label: "Farmer Card",  url: profile.farmer_card_image  },
    { key: "national_id_image",  label: "National ID",  url: profile.national_id_image  },
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
  <a href={doc.url} target="_blank" rel="noopener noreferrer">
    <div className="relative h-40 w-full rounded-xl overflow-hidden border border-neutral-100 bg-slate-50 cursor-pointer hover:opacity-90 transition">
      <Image
        src={doc.url}
        alt={doc.label}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 25vw"
      />

      <div className="absolute top-2 right-2">
        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
          <span className="material-symbols-outlined" style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}>
            check
          </span>
          Uploaded
        </span>
      </div>

      {/* 👇 Optional overlay hint */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition">
        <span className="text-white text-xs opacity-0 hover:opacity-100">
          View full image
        </span>
      </div>
    </div>
  </a>
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

// ── Page skeleton ────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-60 bg-slate-200 rounded-xl" />
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 h-64 bg-slate-100 rounded-xl" />
        <div className="md:col-span-4 h-64 bg-slate-100 rounded-xl" />
        <div className="md:col-span-8 h-56 bg-slate-100 rounded-xl" />
        <div className="md:col-span-4 h-56 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function FarmerProfilePage() {
  const [user,      setUser]      = useState<ApiUser | null>(null);
  const [profile,   setProfile]   = useState<FarmerProfile>({
    age: null, wilaya: "", baladiya: "", farm_size: null, address: "",
    farmer_card_image: null, national_id_image: null,
  });
  const [extras,    setExtras]    = useState<FarmerExtras>({ farms_count: 0 });
  const [userForm,  setUserForm]  = useState<EditableUserFields>({ email: "", username: "", phone: "" });
  const [security,  setSecurity]  = useState<SecuritySetting[]>(DEFAULT_SECURITY_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving,  setIsSaving]  = useState(false);
  const [error,     setError]     = useState("");
  const [toast,     setToast]     = useState("");

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
  }, []);

  const completionItems = [
    { label: "Email",       done: !!userForm.email          },
    { label: "Phone",       done: !!userForm.phone          },
    { label: "Wilaya",      done: !!profile.wilaya          },
    { label: "Baladiya",    done: !!profile.baladiya        },
    { label: "Farm Size",   done: !!profile.farm_size       },
    { label: "Address",     done: !!profile.address         },
    { label: "Farmer Card", done: !!profile.farmer_card_image },
    { label: "National ID", done: !!profile.national_id_image },
    { label: "Verified",    done: user?.is_verified ?? false  },
  ];
  const percent = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  if (isLoading) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark min-h-screen px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto"><Skeleton /></div>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="px-4 sm:px-6 py-8 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-primary font-bold text-xs tracking-widest uppercase">Farmer Profile</span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                Account Overview
              </h1>
              {extras.farms_count > 0 && (
                <p className="text-sm text-slate-500 mt-1">
                  {extras.farms_count} farm{extras.farms_count !== 1 ? "s" : ""} registered
                </p>
              )}
            </div>
          </div>

          {/* Banners */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <span className="material-symbols-outlined text-base">error</span>{error}
            </div>
          )}
          {toast && (
            <div role="status" aria-live="polite" className="flex items-center gap-2 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary-dark font-medium">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {toast}
            </div>
          )}

          {user && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Row 1 */}
              <PersonalDetailsCard
                user={user}
                form={userForm}
                onChange={(k, v) => setUserForm((p) => ({ ...p, [k]: v }))}
              />
              <DocumentsCard profile={profile} />

              {/* Row 2 */}
              <FarmDetailsCard
                profile={profile}
                onChange={(k, v) => setProfile((p) => ({ ...p, [k]: v }))}
              />
            </div>
          )}

          <ProfileCompletion percent={percent} items={completionItems} />
        </div>
      </main>
    </div>
  );
}