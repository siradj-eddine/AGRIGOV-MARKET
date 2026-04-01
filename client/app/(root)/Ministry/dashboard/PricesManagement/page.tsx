"use client";

import { useState } from "react";
import PriceManagementNavbar from "@/components/Ministry/Pricings/PriceManagementNavbar";
import CommodityTable from "@/components/Ministry/Pricings/CommodityTable";
import PriceAdjustmentPanel from "@/components/Ministry/Pricings/PriceAdjustmentPanel";
import AuditLog from "@/components/Ministry/Pricings/AuditLog";
import PricingGuidelinesCard from "@/components/Ministry/Pricings/PricingsGuidelines";
import type { CommodityPrice, ChangeReason } from "@/types/Prices";
import type { AuditEntry } from "@/types/Prices";
import { commodityPrices, auditLog } from "@/types/Prices";

export default function PriceManagementPage() {
  const [items, setItems] = useState<CommodityPrice[]>(commodityPrices);
  const [editing, setEditing] = useState<CommodityPrice | null>(
    items.find((i) => i.id === "2") ?? null // pre-select Rice as per original HTML
  );
  const [log, setLog] = useState<AuditEntry[]>(auditLog);

  const handleEdit = (item: CommodityPrice) => setEditing(item);
  const handleCancel = () => setEditing(null);

  const handleConfirm = (id: string, newPrice: number, reason: ChangeReason) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, officialPrice: newPrice, lastUpdated: `Today, ${timeStr}` }
          : item
      )
    );

    const updated = items.find((i) => i.id === id);
    if (updated) {
      const newEntry: AuditEntry = {
        id: Date.now().toString(),
        actorType: "human",
        actorName: "JD (You)",
        actorBg: "bg-primary/20",
        actorTextColor: "text-primary-dark dark:text-primary",
        actorIcon: "person",
        message: `Updated <b>${updated.name}</b> price from $${updated.officialPrice.toFixed(2)} to $${newPrice.toFixed(2)}. Reason: ${reason}.`,
        timeAgo: "Just now",
      };
      setLog((prev) => [newEntry, ...prev]);
    }

    setEditing(null);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
      <main className="flex-1 py-8 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Page header + KPI mini-cards */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Official Market Price Control
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage and regulate national agricultural commodity prices.
            </p>
          </div>

          <div className="flex gap-4">
            {[
              {
                icon: "inventory_2",
                iconBg: "bg-blue-100 dark:bg-blue-900/30",
                iconColor: "text-blue-600 dark:text-blue-400",
                label: "Tracked Commodities",
                value: String(items.length),
              },
              {
                icon: "update",
                iconBg: "bg-primary/20",
                iconColor: "text-green-700 dark:text-primary",
                label: "Last Global Update",
                value: "2h ago",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-lg border border-border-light dark:border-border-dark shadow-sm flex items-center gap-3"
              >
                <div className={`p-2 rounded-md ${kpi.iconBg} ${kpi.iconColor}`}>
                  <span className="material-icons text-xl">{kpi.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {kpi.label}
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CommodityTable
            items={items}
            onEdit={handleEdit}
            editingId={editing?.id ?? null}
          />

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {editing ? (
              <PriceAdjustmentPanel
                item={editing}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            ) : (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-8 text-center text-slate-400 text-sm">
                <span className="material-icons text-3xl mb-2 block">touch_app</span>
                Select a commodity to adjust its price.
              </div>
            )}

            <AuditLog entries={log} />
            <PricingGuidelinesCard />
          </div>
        </div>
      </main>
    </div>
  );
}