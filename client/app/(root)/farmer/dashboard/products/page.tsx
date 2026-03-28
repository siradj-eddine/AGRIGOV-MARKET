"use client";

import { useState } from "react";
import InventorySidebar from "@/components/Inventory/InventorySideBar";
import StatsOverview from "@/components/Inventory/statsOverview";
import InventoryGrid from "@/components/Inventory/InventoryGrid";
import { navItems, inventoryItems, pendingOrders } from "@/types/Inventory";

export default function InventoryPage() {
  const [orders, setOrders] = useState(pendingOrders);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAcceptOrder = (id: string) =>
    setOrders((prev) => prev.filter((o) => o.id !== id));

  const handleEdit = (id: string) => {
    console.log("Edit item:", id);
    // Open edit modal in a real app
  };

  const handleAddNew = () => {
    console.log("Open add new harvest form");
    // Open new harvest form in a real app
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 antialiased selection:bg-primary selection:text-black">
      <InventorySidebar navItems={navItems} items={inventoryItems} onAddNew={handleAddNew} onEdit={handleEdit} />
      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-background-dark border-b border-earth-100 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold">
              <span className="material-icons text-sm">agriculture</span>
            </div>
            <span className="font-bold text-earth-800 dark:text-white">AgriConnect</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="text-slate-600 dark:text-slate-300"
            aria-label="Toggle menu"
          >
            <span className="material-icons">{mobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>

        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-earth-800 dark:text-white mb-2">
                Inventory Management
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Track your stock levels, manage harvests, and fulfill orders.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                className="flex items-center justify-center px-5 py-2.5 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm text-slate-700 dark:text-slate-200"
              >
                <span className="material-icons text-base mr-2">file_download</span>
                Export Report
              </button>
              <button
                type="button"
                onClick={handleAddNew}
                className="flex items-center justify-center px-5 py-2.5 bg-primary hover:bg-primary-dark text-black rounded-lg text-sm font-bold transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5"
              >
                <span className="material-icons text-base mr-2">add</span>
                New Harvest
              </button>
            </div>
          </div>

          {/* Stats */}
          <StatsOverview pendingOrders={orders} onAcceptOrder={handleAcceptOrder} />

          {/* Inventory */}
          <InventoryGrid
            items={inventoryItems}
            onEdit={handleEdit}
            onAddNew={handleAddNew}
          />
        </div>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
            <span className="material-icons text-sm">verified</span>
            Verified Platform by Ministry of Agriculture
          </p>
        </footer>
      </main>
    </div>
  );
}