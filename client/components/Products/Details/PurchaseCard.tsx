"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ApiProduct } from "@/types/Product";
import { SEASON_LABELS, SEASON_ICONS } from "@/types/Product";
import { cartApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { SHIPPING_FLAT } from "@/types/Cart";

interface Props {
  product: ApiProduct;
}

const MIN_ORDER = 1;

export default function PurchaseCard({ product }: Props) {
  const [quantity,    setQuantity]    = useState(MIN_ORDER);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAdding,    setIsAdding]    = useState(false);
  const [feedback,    setFeedback]    = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const price   = parseFloat(product.unit_price);
  const inStock = product.in_stock && product.stock > 0;
  const maxQty  = product.stock;

  const subtotal = useMemo(
    () => quantity * price + SHIPPING_FLAT,
    [quantity, price],
  );

  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await cartApi.addItem({ product_id: product.id, quantity });
      showFeedback("success", `${quantity} unit${quantity > 1 ? "s" : ""} added to your cart.`);
    } catch (err) {
      showFeedback(
        "error",
        err instanceof ApiError
          ? err.status === 401 ? "Please sign in to add items to your cart." : err.message
          : "Failed to add item. Please try again.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-100 p-6 xl:sticky top-24">

      {/* Title + favourite */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{product.title}</h1>
          <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">{SEASON_ICONS[product.season]}</span>
            {SEASON_LABELS[product.season]} · {product.category.name}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsFavorited((v) => !v)}
          aria-label={isFavorited ? "Remove from favourites" : "Add to favourites"}
        >
          <span
            className={`material-symbols-outlined text-xl transition-colors ${isFavorited ? "text-red-500" : "text-gray-200 hover:text-red-400"}`}
            style={isFavorited ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Price */}
      <div className="mb-5">
        <span className="text-3xl font-extrabold text-gray-900">
          {price.toLocaleString("fr-DZ")}
        </span>
        <span className="text-gray-400 text-sm ml-1">DZD / unit</span>
      </div>

      {/* Stock bar */}
      <div className="mb-5">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-400">Available stock</span>
          <span className={`font-bold ${inStock ? "text-gray-900" : "text-red-500"}`}>
            {inStock ? `${product.stock} units` : "Out of Stock"}
          </span>
        </div>
        <div className="w-full bg-neutral-100 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${inStock ? "bg-primary" : "bg-neutral-200"}`}
            style={{ width: inStock ? `${Math.min(100, (product.stock / 500) * 100)}%` : "100%" }}
          />
        </div>
      </div>

      {/* Quantity stepper */}
      <div className="mb-5 space-y-3">
        <div>
          <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1.5">
            Quantity (units)
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(MIN_ORDER, q - 1))}
              disabled={quantity <= MIN_ORDER}
              className="px-3 py-3 text-gray-400 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">remove</span>
            </button>
            <input
              id="qty"
              type="number"
              min={MIN_ORDER}
              max={maxQty}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(maxQty, Math.max(MIN_ORDER, Number(e.target.value))))
              }
              className="flex-1 text-center py-2 text-sm font-bold text-gray-900 border-x border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty}
              className="px-3 py-3 text-gray-400 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          </div>
        </div>

        {/* Shipping estimate */}
        <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-3 text-xs space-y-1.5">
          <div className="flex justify-between text-gray-400">
            <span>Shipping (flat rate)</span>
            <span className="font-medium text-gray-700">{SHIPPING_FLAT.toLocaleString("fr-DZ")} DZD</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 border-t border-neutral-200 pt-1.5">
            <span>Estimated total</span>
            <span>{subtotal.toLocaleString("fr-DZ")} DZD</span>
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          role="alert"
          className={`mb-4 flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium ${
            feedback.type === "success"
              ? "bg-primary/10 border border-primary/20 text-primary-dark"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          <span
            className="material-symbols-outlined text-sm shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {feedback.type === "success" ? "check_circle" : "error"}
          </span>
          {feedback.msg}
          {feedback.type === "success" && (
            <Link href="/Cart" className="ml-auto underline hover:no-underline">
              View cart
            </Link>
          )}
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
          className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-lg font-bold text-sm text-black bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                add_shopping_cart
              </span>
              Add to Cart
            </>
          )}
        </button>

        <Link
          href="/Cart"
          className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-lg font-semibold text-sm text-gray-900 border border-gray-200 hover:bg-neutral-50 transition-colors"
        >
          <span className="material-symbols-outlined text-base">shopping_cart</span>
          View Cart
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <span className="material-symbols-outlined text-sm text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>
          shield
        </span>
        Secure Payment via Ministry Escrow
      </div>
    </div>
  );
}