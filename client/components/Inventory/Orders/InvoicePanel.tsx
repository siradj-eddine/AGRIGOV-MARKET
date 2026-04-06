"use client";

import { useState } from "react";
import type { ApiOrder, ApiOrderStatus } from "@/types/Orders";
import {
  parseBuyerEmail,
  formatOrderDate,
  STATUS_LABELS,
  STATUS_BADGE,
  STATUS_ICON,
  STATUS_ACTION_LABEL,
} from "@/types/Orders";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  order: ApiOrder;
  isUpdating: boolean;
  onStatusAdvance: (orderId: number, nextStatus: ApiOrderStatus) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export default function InvoicePanel({ order, isUpdating, onStatusAdvance }: Props) {
  // ── Local State for Invoice Loader ──
  const [isDownloading, setIsDownloading] = useState(false);

  const buyerEmail = parseBuyerEmail(order.buyer);
  const totalDZD = parseFloat(order.total_price).toLocaleString("fr-DZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const nextStatus = order.allowed_statuses[0] ?? null;
  const actionLabel = nextStatus ? (STATUS_ACTION_LABEL[nextStatus] ?? STATUS_LABELS[nextStatus]) : null;

  const handleDownloadInvoice = async (orderId: number) => {
    setIsDownloading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}/invoice/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading invoice");
    } finally {
      setIsDownloading(false);
    }
  };

  const actionVariant: Record<string, string> = {
    confirmed: "bg-primary text-slate-900 hover:opacity-90",
    cancelled: "bg-red-500 text-white hover:bg-red-600",
  };
  const actionClass = nextStatus
    ? (actionVariant[nextStatus] ?? "bg-primary text-slate-900 hover:opacity-90")
    : "";

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 sticky top-24">
        {/* ── Header ── */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-xl">
          <div>
            <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white">
              Order #{order.id}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Placed {formatOrderDate(order.created_at)}
            </p>
          </div>
          <span className={`h-9 w-9 rounded-full flex items-center justify-center ${STATUS_BADGE[order.status]}`}>
            <span className="material-icons text-sm">{STATUS_ICON[order.status]}</span>
          </span>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Status</span>
            <OrderStatusBadge status={order.status} showIcon />
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Buyer Info */}
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 shrink-0">
              <span className="material-icons text-base">person</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Buyer</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{buyerEmail}</p>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Line Items */}
          <div>
            <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Items ({order.items.length})</h5>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{item.product.title}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.product.category_name} · {item.product.season} · <span className="font-mono">×{item.quantity}</span>
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap shrink-0">
                    {item.total_price.toLocaleString("fr-DZ", { minimumFractionDigits: 2 })} <span className="text-xs text-gray-400 font-normal">DZD</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Price Display */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Total</span>
            <span className="text-xl font-bold text-gray-900 dark:text-primary font-mono">
              {totalDZD} <span className="text-sm font-semibold text-gray-400">DZD</span>
            </span>
          </div>

          {/* Status Advance Button */}
          {nextStatus && actionLabel && (
            <button
              type="button"
              disabled={isUpdating || isDownloading}
              onClick={() => onStatusAdvance(order.id, nextStatus)}
              className={`w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold shadow-sm transition-all disabled:opacity-60 ${actionClass}`}
            >
              <span className={`material-icons text-base ${isUpdating ? "animate-spin" : ""}`}>
                {isUpdating ? "progress_activity" : STATUS_ICON[nextStatus]}
              </span>
              {isUpdating ? "Updating…" : actionLabel}
            </button>
          )}

          {/* ── Document Actions with Loader ── */}
          <div className="flex flex-col gap-2">
<button
  type="button"
  disabled={isDownloading}
  onClick={() => handleDownloadInvoice(order.id)}
  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold shadow-sm 
             text-gray-900 bg-primary hover:opacity-90 disabled:opacity-70 transition-all"
>
  {/* Spinner */}
  {isDownloading ? (
    <svg
      className="w-4 h-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
      />
    </svg>
  ) : (
    <span className="material-icons text-base">download</span>
  )}

  {/* Text */}
  <span className="whitespace-nowrap">
    {isDownloading ? "Generating PDF..." : "Download Invoice PDF"}
  </span>
</button>
          </div>

          <p className="text-center text-xs text-gray-400">
            Official Ministry of Agriculture Document.<br />
            Document ID: AGR-{order.id.toString().padStart(6, "0")}
          </p>
        </div>
      </div>
    </div>
  );
}