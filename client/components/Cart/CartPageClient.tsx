"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb  from "@/components/Cart/BreadCrumb";
import CartItemRow from "@/components/Cart/CartItemRow";
import OrderSummary from "@/components/Cart/OrderSummary";
import { cartApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { CartResponse } from "@/types/Cart";

const CRUMBS = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Shopping Cart" },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CartSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-neutral-100 p-5">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-neutral-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-neutral-200 rounded" />
              <div className="h-3 w-64 bg-neutral-100 rounded" />
              <div className="h-3 w-28 bg-neutral-100 rounded" />
            </div>
            <div className="w-32 h-10 bg-neutral-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShoppingCart() {
  const [cart,      setCart]      = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState("");
  const [toast,     setToast]     = useState("");

  // ── Fetch cart ──────────────────────────────────────────────────────────────

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await cartApi.get();
      setCart(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 401
            ? "Please sign in to view your cart."
            : err.message
          : "Failed to load your cart. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  // ── Show toast helper ───────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Quantity update (optimistic) ────────────────────────────────────────────

const handleQuantityChange = useCallback(async (productId: number, qty: number) => {
  if (!cart || qty < 1) return;

  // 1. Optimistic update (Keep this, it's good for UX!)
  setCart((prev) =>
    prev ? {
      ...prev,
      items: prev.items.map((it) =>
        it.product.id === productId
          ? { ...it, quantity: qty, total_price: parseFloat(it.price) * qty }
          : it
      ),
    } : prev
  );

 try {
    const updated = await cartApi.updateQuantity({ product_id: productId, quantity: qty });
    
    if (updated && Array.isArray(updated.items)) {
      setCart(updated);  // ← This expects the full cart object
        setCart(prev => prev ? { ...prev, items: prev.items.map((it) => it.product.id === productId ? { ...it, quantity: qty, total_price: parseFloat(it.price) * qty } : it) } : prev);
    } else {
      await loadCart();  // ← Falls back to reloading
    }
  } catch (err) {
    await loadCart();
  }
  console.log(`Updated product ${productId} to quantity ${qty}`);

}, [cart, loadCart]);

  // ── Remove item ─────────────────────────────────────────────────────────────

  const handleRemove = useCallback(async (itemId: number) => {
    if (!cart) return;

    // Optimistic remove
    setCart((prev) =>
      prev ? { ...prev, items: prev.items.filter((it) => it.id !== itemId) } : prev,
    );

    try {
      const updated = await cartApi.removeItem({ item_id: itemId });
      setCart(updated);
      showToast("Item removed from cart.");
    } catch (err) {
      await loadCart();
      showToast(err instanceof ApiError ? err.message : "Failed to remove item.");
    }
  }, [cart, loadCart]);

  // ── Clear cart ──────────────────────────────────────────────────────────────

  const handleClearCart = useCallback(async () => {
    try {
      const updated = await cartApi.clearCart();
      setCart(updated);
      showToast("Cart cleared.");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to clear cart.");
    }
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="bg-background-light font-display text-slate-800 min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Breadcrumb crumbs={CRUMBS} />

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Agricultural Basket</h1>
        <p className="text-sm text-gray-500 mb-8">
          Review items, adjust quantities, and proceed to secure checkout.
        </p>

        {/* Toast */}
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 flex items-center gap-2 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary-dark font-medium"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            {toast}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            {error}
            <button
              type="button"
              onClick={loadCart}
              className="ml-auto text-xs font-medium underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

          {/* ── Cart items ─────────────────────────────────────────────────── */}
          <section className="lg:col-span-8">
            <div className="bg-white shadow-sm border border-neutral-100 rounded-xl overflow-hidden mb-4">

              {/* Table header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-neutral-100 bg-neutral-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Subtotal</div>
              </div>

              {isLoading ? (
                <div className="p-5">
                  <CartSkeleton />
                </div>
              ) : cart && cart?.items?.length > 0 ? (
                cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQuantityChange={(newQty) => handleQuantityChange(item.product.id, newQty)}
                  onRemove={() => handleRemove(item.product.id) }
                />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                  <span
                    className="material-symbols-outlined text-6xl mb-4"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    shopping_basket
                  </span>
                  <p className="text-base font-semibold text-gray-500">Your basket is empty.</p>
                  <Link
                    href="/marketplace"
                    className="mt-4 text-sm text-primary-dark hover:underline font-medium flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">storefront</span>
                    Browse the Marketplace
                  </Link>
                </div>
              )}
            </div>

            {/* Continue shopping */}
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-sm text-primary-dark hover:underline font-medium"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Continue Shopping
            </Link>
          </section>

          {/* ── Order summary ─────────────────────────────────────────────── */}
          <section className="lg:col-span-4 mt-8 lg:mt-0">
            <OrderSummary
              totalPrice={cart?.total_price ?? 0}
              totalItems={cart?.total_items ?? 0}
              farmCount={cart?.farms?.length ?? 0}
              onClearCart={handleClearCart}
              isLoading={isLoading}
            />
          </section>
        </div>
      </main>
    </div>
  );
}