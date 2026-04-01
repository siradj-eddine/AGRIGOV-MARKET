"use client";
import { useState } from "react";
import AdminSidebar from "@/components/Ministry/AdminSideBar";
import AdminHeader from "@/components/Ministry/AdminHeader";
import KpiCards from "@/components/Ministry/KpiCards";
import RegionalMap from "@/components/Ministry/RegionalMap";
import PriceRegulationPanel from "@/components/Ministry/PriceRegulationsPanel";
import PriceTrendsChart from "@/components/Ministry/PriceTrends";
import TransactionsTable from "@/components/Ministry/TransactionTable";
import { adminNavItems, recentTransactions } from "@/types/Ministry";

export default function AdminDashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 antialiased h-screen flex overflow-hidden">
      <AdminSidebar items={adminNavItems} />

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main wrapper */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page title & actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Overview Dashboard
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Real-time agricultural metrics and regulatory controls.
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 bg-white dark:bg-[#1a331a] border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-slate-700 dark:text-slate-300"
                >
                  <span className="material-icons text-base mr-2">cloud_download</span>
                  Export Report
                </button>
                <button
                  type="button"
                  className="flex items-center px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold hover:bg-green-400 transition-colors shadow-md shadow-primary/20"
                >
                  <span className="material-icons text-base mr-2">add</span>
                  New Regulation
                </button>
              </div>
            </div>

            {/* KPIs */}
            <KpiCards />

            {/* Map + Regulation + Trend chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RegionalMap />

              {/* Right column */}
              <div className="flex flex-col gap-6">
                <PriceRegulationPanel />
                <PriceTrendsChart />
              </div>
            </div>

            {/* Transactions */}
            <TransactionsTable transactions={recentTransactions} />

            {/* Footer */}
            <footer className="text-center text-xs text-slate-400 pb-6">
              <p>
                © {new Date().getFullYear()} Ministry of Agriculture. All rights reserved. |{" "}
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}