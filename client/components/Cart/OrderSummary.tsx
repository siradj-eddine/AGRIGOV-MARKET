"use client";

import { useState } from "react";
import { LEVY_RATE, SHIPPING_FLAT } from "@/types/Cart";
import Link from "next/link";

interface Props {
  totalPrice:    number;  // raw sum from API
  totalItems:    number;
  farmCount:     number;
  onClearCart:   () => Promise<void>;
  isLoading:     boolean;
}

const fmt = (n: number) =>
  n.toLocaleString("fr-DZ", { minimumFractionDigits: 2 }) + " DZD";

export default function OrderSummary({
  totalPrice, totalItems, farmCount, onClearCart, isLoading,
}: Props) {
  const [promoCode,    setPromoCode]    = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isClearing,   setIsClearing]   = useState(false);

  const levy     = totalPrice * LEVY_RATE;
  const shipping = totalItems > 0 ? SHIPPING_FLAT : 0;
  const total    = totalPrice + levy + shipping;

  const handleApplyPromo = () => {
    // Placeholder — wire to real promo endpoint when available
    if (promoCode.trim()) setPromoApplied(true);
  };

  const handleClear = async () => {
    setIsClearing(true);
    await onClearCart();
    setIsClearing(false);
  };

  return (
    <div className="sticky top-24 space-y-4">

      {/* ── Summary card ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
          {totalItems > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isClearing || isLoading}
              className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1 disabled:opacity-40"
            >
              {isClearing ? (
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
              )}
              Clear cart
            </button>
          )}
        </div>

        {/* Logistics info */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-5">
          <div className="flex items-start gap-3">
            <span
              className="material-symbols-outlined text-primary-dark text-xl shrink-0 mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_shipping
            </span>
            <div className="w-full space-y-1.5">
              <h4 className="text-sm font-semibold text-gray-900">Logistics Summary</h4>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total items</span>
                <span className="font-medium text-gray-900">{totalItems}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Farms involved</span>
                <span className="font-medium text-gray-900">{farmCount}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Shipping (flat rate)</span>
                <span className="font-medium text-gray-900">{fmt(shipping)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial breakdown */}
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-500">
            <dt>Products subtotal</dt>
            <dd className="font-medium text-gray-900">{fmt(totalPrice)}</dd>
          </div>
          <div className="flex justify-between text-gray-500">
            <dt>Shipping</dt>
            <dd className="font-medium text-gray-900">{fmt(shipping)}</dd>
          </div>
          <div className="flex justify-between text-gray-500">
            <dt className="flex items-center gap-1">
              Platform levy ({(LEVY_RATE * 100).toFixed(0)}%)
              <span
                className="material-symbols-outlined text-gray-300 text-xs cursor-help"
                title="Covers Ministry platform and escrow services"
              >
                info
              </span>
            </dt>
            <dd className="font-medium text-gray-900">{fmt(levy)}</dd>
          </div>

          {promoApplied && (
            <div className="flex justify-between text-green-600">
              <dt className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_offer
                </span>
                Promo ({promoCode})
              </dt>
              <dd className="font-medium">— 0 DZD</dd>
            </div>
          )}

          <div className="border-t border-neutral-100 pt-3 flex justify-between">
            <dt className="text-base font-bold text-gray-900">Total</dt>
            <dd className="text-xl font-bold text-primary-dark">{fmt(total)}</dd>
          </div>
        </dl>

        {/* CTA */}
        <Link
          href="/Checkout"
          className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-primary hover:bg-primary-dark text-black font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          Proceed to Checkout
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>

        <p className="mt-3 text-xs text-center text-gray-400 flex items-center justify-center gap-1">
          <span
            className="material-symbols-outlined text-sm text-green-500"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lock
          </span>
          Secured by Ministry Escrow
        </p>
      </div>

      {/* ── Promo code ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
        <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
          Have a voucher code?
        </label>
        <div className="flex gap-2">
          <input
            id="promo"
            type="text"
            value={promoCode}
            onChange={(e) => { setPromoCode(e.target.value); setPromoApplied(false); }}
            placeholder="Enter code"
            className="block w-full rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:border-primary focus:ring-primary focus:outline-none py-2.5 px-3 transition"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            disabled={!promoCode.trim()}
            className="bg-gray-900 hover:bg-gray-700 text-white px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-40"
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            Promo code applied!
          </p>
        )}
      </div>
    </div>
  );
}