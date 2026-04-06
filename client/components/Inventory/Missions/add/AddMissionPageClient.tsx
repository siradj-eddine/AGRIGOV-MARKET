"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FarmerSidebar from "@/components/Inventory/AddProduct/FarmSidebar";
import { farmerMissionApi, ApiError } from "@/lib/api";
import type { MissionCreatePayload } from "@/types/Missions";

// ─── helpers ──────────────────────────────────────────────────────────────────

const inputClass =
  "w-full bg-neutral-50 dark:bg-earth-800 border border-neutral-200 dark:border-border-dark rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-400";

const labelClass =
  "text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5 block ml-0.5";

// ─── Special handling chips ───────────────────────────────────────────────────

const HANDLING_OPTIONS = [
  { id: "moisture",  label: "Moisture Control",  icon: "water_drop"   },
  { id: "temp",      label: "Temp Monitored",     icon: "thermostat"   },
  { id: "organic",   label: "Organic Only",       icon: "eco"          },
  { id: "fragile",   label: "Fragile Cargo",      icon: "inventory_2"  },
];

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  order:            string;
  pickup_address:   string;
  delivery_address: string;
  notes:            string;
  handling:         string[];
}

const EMPTY_FORM: FormState = {
  order:            "",
  pickup_address:   "",
  delivery_address: "",
  notes:            "",
  handling:         [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddMissionPage() {
  const router = useRouter();

  const [form,       setForm]       = useState<FormState>(EMPTY_FORM);
  const [isPosting,  setIsPosting]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [fieldErrors,setFieldErrors]= useState<Partial<Record<keyof FormState, string>>>({});

  // ── field helpers ──────────────────────────────────────────────────────────
  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const toggleHandling = (id: string) => {
    setField(
      "handling",
      form.handling.includes(id)
        ? form.handling.filter((h) => h !== id)
        : [...form.handling, id]
    );
  };

  // ── validation ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.order.trim() || isNaN(Number(form.order)))
      errs.order = "Enter a valid numeric Order ID.";
    if (!form.pickup_address.trim())
      errs.pickup_address = "Pickup address is required.";
    if (!form.delivery_address.trim())
      errs.delivery_address = "Delivery address is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setError(null);
      setIsPosting(true);

      // Merge handling tags into notes
      const handlingLines = form.handling.map(
        (h) => HANDLING_OPTIONS.find((o) => o.id === h)?.label ?? h
      );
      const notesWithHandling = [
        form.notes.trim(),
        ...(handlingLines.length
          ? [`Handling: ${handlingLines.join(", ")}`]
          : []),
      ]
        .filter(Boolean)
        .join("\n");

      const payload: MissionCreatePayload = {
        order:            Number(form.order),
        pickup_address:   form.pickup_address.trim(),
        delivery_address: form.delivery_address.trim(),
        notes:            notesWithHandling || undefined,
      };

      try {
        await farmerMissionApi.create(payload);
        router.push("/farmer/dashboard/missions");
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to create mission. Please try again."
        );
      } finally {
        setIsPosting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, router]
  );

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-10">

          {/* ── Page header ── */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-slate-500 text-sm mb-2 font-medium">
                <Link
                  href="/farmer/dashboard/missions"
                  className="hover:text-primary transition-colors"
                >
                  Missions
                </Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-800 dark:text-slate-200">Create Mission</span>
              </nav>
              <h1 className="text-4xl font-extrabold tracking-tight">
                Create Mission
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl text-sm">
                Request a verified transporter to move your sold crop batch. All fields
                except notes are required.
              </p>
            </div>

            {/* Info chip */}
            <div className="flex items-center gap-2 bg-primary-light dark:bg-primary/20 text-primary-dark px-4 py-2.5 rounded-xl text-xs font-bold shrink-0">
              <span className="material-symbols-outlined text-[16px]">group</span>
              Transporters will bid within 2 hours
            </div>
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              <span className="material-symbols-outlined mt-0.5 shrink-0">error</span>
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                aria-label="Dismiss"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          {/* ── Bento form grid ── */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* ── Left column: core details ── */}
              <div className="md:col-span-7 space-y-6">

                {/* Order Selection */}
                <section className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-neutral-light dark:border-border-dark p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary-dark text-[20px]">
                        inventory_2
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">Select Order</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="order-id" className={labelClass}>
                        Confirmed Order ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="order-id"
                        type="number"
                        min={1}
                        value={form.order}
                        onChange={(e) => setField("order", e.target.value)}
                        placeholder="e.g. 27"
                        className={inputClass}
                      />
                      {fieldErrors.order && (
                        <p className="text-xs text-red-500 mt-1 ml-0.5">
                          {fieldErrors.order}
                        </p>
                      )}
                    </div>

                    {form.order && !isNaN(Number(form.order)) && Number(form.order) > 0 && (
                      <div className="bg-primary-light dark:bg-primary/10 rounded-xl p-4 flex items-start gap-3">
                        <span
                          className="material-symbols-outlined text-primary-dark mt-0.5"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          info
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            Order #{form.order} selected
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Make sure this order is in <strong>confirmed</strong> status before
                            creating a mission.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Special Handling */}
                <section className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-neutral-light dark:border-border-dark p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-earth-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-[20px]">
                        humidity_mid
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">Special Handling</h3>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {HANDLING_OPTIONS.map((opt) => {
                      const checked = form.handling.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleHandling(opt.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all cursor-pointer ${
                            checked
                              ? "border-primary bg-primary-light dark:bg-primary/20 text-primary-dark"
                              : "border-neutral-200 dark:border-border-dark bg-neutral-50 dark:bg-earth-800 text-slate-600 dark:text-slate-400 hover:border-primary/50"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {opt.icon}
                          </span>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label htmlFor="notes" className={labelClass}>
                      Additional Instructions
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      value={form.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                      placeholder="e.g. Tarp must be breathable wheat-grade, handle with care…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </section>
              </div>

              {/* ── Right column: location & schedule ── */}
              <div className="md:col-span-5 space-y-6">

                {/* Pickup Location */}
                <section className="bg-white dark:bg-neutral-dark rounded-2xl shadow-sm border border-neutral-light dark:border-border-dark p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary-dark text-[20px]">
                        trip_origin
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">Pickup Location</h3>
                  </div>

                  <div>
                    <label htmlFor="pickup" className={labelClass}>
                      Pickup Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="pickup"
                      type="text"
                      value={form.pickup_address}
                      onChange={(e) => setField("pickup_address", e.target.value)}
                      placeholder="e.g. Djelfa, Farm Sector B"
                      className={inputClass}
                    />
                    {fieldErrors.pickup_address && (
                      <p className="text-xs text-red-500 mt-1 ml-0.5">
                        {fieldErrors.pickup_address}
                      </p>
                    )}
                  </div>

                  {/* Visual separator */}
                  <div className="flex items-center gap-3 my-4 px-2">
                    <div className="w-px h-8 bg-primary/20 ml-1" />
                    <span className="material-symbols-outlined text-slate-300 text-[18px]">
                      arrow_downward
                    </span>
                  </div>

                  <div>
                    <label htmlFor="delivery" className={labelClass}>
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="delivery"
                      type="text"
                      value={form.delivery_address}
                      onChange={(e) => setField("delivery_address", e.target.value)}
                      placeholder="e.g. Laghouat Central Silo"
                      className={inputClass}
                    />
                    {fieldErrors.delivery_address && (
                      <p className="text-xs text-red-500 mt-1 ml-0.5">
                        {fieldErrors.delivery_address}
                      </p>
                    )}
                  </div>
                </section>

                {/* Route summary (live preview) */}
                {(form.pickup_address || form.delivery_address) && (
                  <section className="bg-neutral-50 dark:bg-earth-800 rounded-2xl border border-neutral-200 dark:border-border-dark p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                      Route Preview
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          trip_origin
                        </span>
                        <span className="text-sm font-semibold capitalize">
                          {form.pickup_address || "—"}
                        </span>
                      </div>
                      <div className="ml-2 w-px h-5 bg-primary/30" />
                      <div className="flex items-center gap-3">
                        <span
                          className="material-symbols-outlined text-primary text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          location_on
                        </span>
                        <span className="text-sm font-semibold capitalize">
                          {form.delivery_address || "—"}
                        </span>
                      </div>
                    </div>
                  </section>
                )}

                {/* Submit */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isPosting}
                    className="w-full flex items-center justify-center gap-3 bg-primary text-slate-900 font-black text-base py-4 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isPosting ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">
                          progress_activity
                        </span>
                        Posting Mission…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">
                          local_shipping
                        </span>
                        Post Mission
                      </>
                    )}
                  </button>

                  <Link
                    href="/farmer/dashboard/missions"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-200 dark:border-border-dark text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-earth-800 transition-colors"
                  >
                    Cancel
                  </Link>

                  <p className="text-center text-xs text-slate-400 leading-relaxed px-2">
                    Transporters in your wilaya will receive this mission and can
                    accept it within 2 hours.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}