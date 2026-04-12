"use client";

import Image from "next/image";
import { useState } from "react";
import type { DriverStatus } from "@/types/Transporter";

const STATUS_CYCLE: DriverStatus[] = ["Online", "Offline", "On Break"];
const statusDotClass: Record<DriverStatus, string> = {
  Online: "bg-primary animate-pulse",
  Offline: "bg-slate-400",
  "On Break": "bg-amber-400",
};

// Fallback avatar URL (you can replace with dynamic user avatar later)
const FALLBACK_AVATAR_URL = "https://ui-avatars.com/api/?background=0df20d&color=000&name=Driver";

export default function TransporterHeader() {
  const [status, setStatus] = useState<DriverStatus>("Online");

  const cycleStatus = () => {
    const i = STATUS_CYCLE.indexOf(status);
    setStatus(STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length]);
  };

  return (
    <header className="h-16 bg-white dark:bg-[#1a2e1a] border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-20 shadow-sm shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-black font-bold">
          <span className="material-icons text-xl">agriculture</span>
        </div>
        <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
          AgriLogistics{" "}
          <span className="text-slate-400 font-normal mx-2">|</span>
          Transporter Hub
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-6">
        {/* Status toggle */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Status
          </span>
          <button
            type="button"
            onClick={cycleStatus}
            className="flex items-center gap-2 bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-600 transition-colors"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${statusDotClass[status]}`} />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {status}
            </span>
          </button>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <span className="material-icons">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2e1a]" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">Driver Name</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vehicle: Truck</p>
          </div>
          <div className="relative w-9 h-9 shrink-0">
            <Image
              src={FALLBACK_AVATAR_URL}
              alt="Driver avatar"
              fill
              className="rounded-full object-cover border border-slate-200 dark:border-slate-600"
              sizes="36px"
            />
          </div>
        </div>
      </div>
    </header>
  );
}