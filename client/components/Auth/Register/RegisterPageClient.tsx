"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ApiError } from "@/lib/api";

import Stepper           from "./Stepper";
import RoleStep          from "./RoleStep";
import AccountStep       from "./AccountStep";
import ProfileStep       from "./ProfileStep";
import SuccessStep       from "./SuccessStep";
import RegistrationSidebar from "./SideBar";

import type {
  RegisterRole,
  RegistrationStep,
  AccountFormState,
  FarmerProfileState,
  BuyerProfileState,
  TransporterProfileState,
} from "@/types/Register";
import { COAT_OF_ARMS_URL } from "@/types/Register";

// ─── Initial states ───────────────────────────────────────────────────────────

const INITIAL_ACCOUNT: AccountFormState = {
  email: "", username: "", phone: "", password: "", confirmPassword: "",
};

const INITIAL_FARMER: FarmerProfileState = {
  wilaya: "", baladiya: "", farm_name: "", farm_size: "", Address: "",
  farmer_card_image: null, national_card_image: null, age: "0"
};

const INITIAL_BUYER: BuyerProfileState = {
  age: "", business_license_image: null,
};

const INITIAL_TRANSPORTER: TransporterProfileState = {
  age: "", vehicule_type: "", vehicule_model: "", vehicule_year: "",
  vehicule_capacity: "", driver_license_image: null, grey_card_image: null,
};

// ─── Validation ───────────────────────────────────────────────────────────────

function validateAccount(form: AccountFormState): string | null {
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return "Please enter a valid email address.";
  if (!form.username.trim())
    return "Username is required.";
  if (!/^(\+?213|0)[5-7]\d{8}$/.test(form.phone.replace(/\s/g, "")))
    return "Enter a valid Algerian phone number (e.g. 0550000000).";
  if (form.password.length < 8)
    return "Password must be at least 8 characters.";
  if (form.password !== form.confirmPassword)
    return "Passwords do not match.";
  return null;
}

function validateProfile(role: RegisterRole, f: FarmerProfileState, b: BuyerProfileState, t: TransporterProfileState): string | null {
  if (role === "FARMER") {
    if (!f.wilaya)             return "Please select your wilaya.";
    if (!f.baladiya.trim())    return "Baladiya is required.";
    if (!f.farm_name.trim())   return "Farm name is required.";
    if (!f.farm_size)          return "Farm size is required.";
    if (!f.age || Number(f.age) < 18)  return "Please enter a valid age (18+).";
    if (!f.Address.trim())     return "Address is required.";
    if (!f.farmer_card_image)  return "Farmer card image is required.";
    if (!f.national_card_image) return "National ID card is required.";
  }
  if (role === "BUYER") {
    if (!b.age || Number(b.age) < 18)  return "Please enter a valid age (18+).";
    if (!b.business_license_image)     return "Business license image is required.";
  }
  if (role === "TRANSPORTER") {
    if (!t.age || Number(t.age) < 18)  return "Please enter a valid age (18+).";
    if (!t.vehicule_type)              return "Vehicle type is required.";
    if (!t.vehicule_model.trim())      return "Vehicle model is required.";
    if (!t.vehicule_year)              return "Vehicle year is required.";
    if (!t.vehicule_capacity)          return "Vehicle capacity is required.";
    if (!t.driver_license_image)       return "Driver's license image is required.";
    if (!t.grey_card_image)            return "Grey card (vehicle registration) is required.";
  }
  return null;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

async function registerUser(account: AccountFormState, role: RegisterRole) {
  const res = await fetch(`${BASE}/api/users/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email:    account.email.trim(),
      username: account.username.trim(),
      phone:    account.phone.replace(/\s/g, ""),
      password: account.password,
      role,
    }),
  });
  const json = await res.json().catch(() => ({}));
  console.log(json);
  if (!res.ok) throw new ApiError(res.status, json?.message ?? json?.detail ?? "Registration failed.");
  localStorage.setItem("access", json?.data?.tokens?.access ?? "");
  localStorage.setItem("refresh", json?.data?.tokens?.refresh ?? "");  
  return json; // { status, code, message, data: { user } }
}

async function submitFarmerProfile(form: FarmerProfileState) {
  const fd = new FormData();
  fd.append("wilaya",    form.wilaya);
  fd.append("baladiya",  form.baladiya);
  fd.append("farm_name", form.farm_name);
  fd.append("farm_size", form.farm_size);
  fd.append("address",   form.Address);
  
  fd.append("age", form.age ?? ""); // Optional field, send empty string if not provided
  if (form.farmer_card_image)  fd.append("farmer_card_image",  form.farmer_card_image);
  if (form.national_card_image) fd.append("national_id_image", form.national_card_image);

  const res = await fetch(`${BASE}/api/users/auth/farmer-profile/`, { method: "POST", body: fd , headers: { "Authorization": `Bearer ${localStorage.getItem("access") ?? ""}` }});
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json?.message ?? "Failed to submit farmer profile.");
}

async function submitBuyerProfile(form: BuyerProfileState) {
  const fd = new FormData();
  fd.append("age", form.age);
  if (form.business_license_image) fd.append("bussiness_license_image", form.business_license_image);

  const res = await fetch(`${BASE}/api/users/auth/buyer-profile/`, { method: "POST", body: fd , headers: { "Authorization": `Bearer ${localStorage.getItem("access") ?? ""}` }});
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json?.message ?? "Failed to submit buyer profile.");
}

async function submitTransporterProfile(form: TransporterProfileState) {
  const fd = new FormData();
  fd.append("age",              form.age);
  fd.append("vehicle_type",    form.vehicule_type);
  fd.append("vehicle_model",   form.vehicule_model);
  fd.append("vehicle_year",    form.vehicule_year);
  fd.append("vehicle_capacity", form.vehicule_capacity);
  if (form.driver_license_image) fd.append("driver_license_image", form.driver_license_image);
  if (form.grey_card_image)      fd.append("grey_card_image",        form.grey_card_image);

  const res = await fetch(`${BASE}/api/users/auth/transporter-profile/`, { method: "POST", body: fd ,headers:{ "Authorization": `Bearer ${localStorage.getItem("access") ?? ""}` }});
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json?.message ?? "Failed to submit transporter profile.");
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegistrationPage() {
  const [step,       setStep]       = useState<RegistrationStep>(1);
  const [done,       setDone]       = useState(false);
  const [role,       setRole]       = useState<RegisterRole>("FARMER");
  const [account,    setAccount]    = useState<AccountFormState>(INITIAL_ACCOUNT);
  const [farmer,     setFarmer]     = useState<FarmerProfileState>(INITIAL_FARMER);
  const [buyer,      setBuyer]      = useState<BuyerProfileState>(INITIAL_BUYER);
  const [transporter, setTransporter] = useState<TransporterProfileState>(INITIAL_TRANSPORTER);
  const [error,      setError]      = useState("");
  const [isLoading,  setIsLoading]  = useState(false);

  const setAccountField = useCallback(
    <K extends keyof AccountFormState>(k: K, v: AccountFormState[K]) =>
      setAccount((p) => ({ ...p, [k]: v })),
    [],
  );

  const setFarmerField = useCallback(
    <K extends keyof FarmerProfileState>(k: K, v: FarmerProfileState[K]) =>
      setFarmer((p) => ({ ...p, [k]: v })),
    [],
  );

  const setBuyerField = useCallback(
    <K extends keyof BuyerProfileState>(k: K, v: BuyerProfileState[K]) =>
      setBuyer((p) => ({ ...p, [k]: v })),
    [],
  );

  const setTransporterField = useCallback(
    <K extends keyof TransporterProfileState>(k: K, v: TransporterProfileState[K]) =>
      setTransporter((p) => ({ ...p, [k]: v })),
    [],
  );

  // ── Navigation ──────────────────────────────────────────────────────────────

  const handleBack = () => {
    setError("");
    if (step > 1) setStep((s) => (s - 1) as RegistrationStep);
  };

  const handleContinue = async () => {
    setError("");

    // Step 1 → 2: just advance
    if (step === 1) {
      setStep(2);
      return;
    }

    // Step 2 → 3: validate account fields
    if (step === 2) {
      const err = validateAccount(account);
      if (err) { setError(err); return; }
      setStep(3);
      return;
    }

    // Step 3: validate profile, then call both APIs
    const profileErr = validateProfile(role, farmer, buyer, transporter);
    if (profileErr) { setError(profileErr); return; }

    setIsLoading(true);
    try {
      // 1 — create the base account
      await registerUser(account, role);

      // 2 — submit the role-specific profile
      if (role === "FARMER")      await submitFarmerProfile(farmer);
      if (role === "BUYER")        await submitBuyerProfile(buyer);
      if (role === "TRANSPORTER") await submitTransporterProfile(transporter);

      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        // If it's a 4xx on the register call, drop back to step 2
        if (err.status === 400 || err.status === 409) setStep(2);
        setError(err.message);
      } else {
        setError("Unable to connect. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="bg-background-light font-display text-gray-800 min-h-screen flex flex-col">
      <main className="grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-start">
          <RegistrationSidebar />

          {/* Form card */}
          <div className="lg:col-span-8 w-full">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

              {done ? (
                <div className="p-6 sm:p-8">
                  <SuccessStep email={account.email} />
                </div>
              ) : (
                <>
                  <Stepper currentStep={step} />

                  <div className="p-6 sm:p-8 space-y-8">

                    {/* Error banner */}
                    {error && (
                      <div
                        role="alert"
                        className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                      >
                        <span className="material-symbols-outlined text-base shrink-0">error</span>
                        {error}
                      </div>
                    )}

                    {/* Step content */}
                    <div key={step}>
                      {step === 1 && (
                        <RoleStep selected={role} onSelect={(r) => { setRole(r); setError(""); }} />
                      )}
                      {step === 2 && (
                        <AccountStep role={role} form={account} onChange={setAccountField} />
                      )}
                      {step === 3 && (
                        <ProfileStep
                          role={role}
                          farmerForm={farmer}
                          buyerForm={buyer}
                          transporterForm={transporter}
                          onFarmerChange={setFarmerField}
                          onBuyerChange={setBuyerField}
                          onTransporterChange={setTransporterField}
                        />
                      )}
                    </div>

                    {/* Navigation */}
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={step === 1}
                        className="group inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">
                          arrow_back
                        </span>
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleContinue}
                        disabled={isLoading}
                        className="group inline-flex items-center gap-2 px-8 py-3 border border-transparent text-sm font-bold rounded-lg text-black bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-base">
                              progress_activity
                            </span>
                            Submitting…
                          </>
                        ) : (
                          <>
                            {step === 3 ? "Submit Application" : "Continue"}
                            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                              {step === 3 ? "check" : "arrow_forward"}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!done && (
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary-dark font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="relative h-7 w-7">
                    <Image
                      src={COAT_OF_ARMS_URL}
                      alt="National Coat of Arms"
                      fill
                      className="object-contain"
                      sizes="28px"
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest border-l border-gray-300 pl-4">
                    Official Ministry Platform
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}