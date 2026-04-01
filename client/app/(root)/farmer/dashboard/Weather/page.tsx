"use client";

import { useState } from "react";
import Link from "next/link";
import WeatherNavbar from "@/components/Weather/WeatherNavbar";
import SmartAlertBanner from "@/components/Weather/SmartAlertBanner";
import CurrentConditionsCard from "@/components/Weather/CurrentConditionCard";
import ForecastGrid from "@/components/Weather/ForeCastGrid";
import DeepDiveCharts from "@/components/Weather/DeepDiveCharts";
import SeasonalOutlookWidget from "@/components/Weather/SeasonalOutlook";
import PlatformActionsCard from "@/components/Weather/Platformactionscard";
import { ZONES, smartAlerts } from "@/types/Weather";

export default function WeatherPage() {
  const [activeZoneId, setActiveZoneId] = useState(ZONES[0].id);
  const activeZone = ZONES.find((z) => z.id === activeZoneId) ?? ZONES[0];

  // Current date derived at runtime
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const lastUpdated = "10:45 AM";

  return (
    <div className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display min-h-screen flex flex-col">

      <main className="grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header + date */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Weather Intelligence Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Real-time agricultural monitoring for{" "}
              <span className="text-primary">{activeZone.label.split(": ")[1]}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{dateLabel}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Smart alerts */}
        <div className="space-y-3">
          {smartAlerts.map((alert) => (
            <SmartAlertBanner key={alert.id} alert={alert} />
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8-col column */}
          <div className="lg:col-span-8 space-y-6">
            <CurrentConditionsCard />
            <ForecastGrid />
            <DeepDiveCharts />
          </div>

          {/* Right 4-col column */}
          <div className="lg:col-span-4 space-y-6">
            <SeasonalOutlookWidget zoneName={activeZone.label} />
            <PlatformActionsCard />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-primary/20 mt-12 py-8 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Ministry of Agriculture. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            {["Privacy Policy", "Terms of Service", "Support"].map((label) => (
              <Link key={label} href="#" className="hover:text-primary transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}