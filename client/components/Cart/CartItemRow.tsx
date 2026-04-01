"use client";

import Image from "next/image";
import { useState } from "react";
import type { CartItem } from "@/types/Cart";

const PLACEHOLDER = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200&q=80";

interface Props {
  item: CartItem;
  onQuantityChange: (qty: number) => Promise<void>; // Removed itemId
  onRemove: (itemId: number) => Promise<void>;
}

export default function CartItemRow({ item, onQuantityChange, onRemove }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const product   = item.product;
  const imageUrl  = product.images[0]?.image ?? PLACEHOLDER;
  const unitPrice = parseFloat(item.price);
  const subtotal  = item.total_price;
  const location  = [product.farm.wilaya, product.farm.baladiya].filter(Boolean).join(", ");

const handleDecrement = async () => {
    if (item.quantity <= 1) return;
    setIsUpdating(true);
    await onQuantityChange(item.quantity - 1); 
    setIsUpdating(false);
  };

  const handleIncrement = async () => {
    if (item.quantity >= product.stock) return;
    setIsUpdating(true);
    await onQuantityChange(item.quantity + 1); 
    setIsUpdating(false);
  };

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1 || val > product.stock) return;
    setIsUpdating(true);
    // Send ONLY the new value
    await onQuantityChange(val); 
    setIsUpdating(false);
  }

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(item.id);
    // No need to setIsRemoving(false) — component will unmount
  };

  return (
    <div className={`p-5 border-b border-gray-100 last:border-0 transition-opacity ${isRemoving ? "opacity-40 pointer-events-none" : "hover:bg-gray-50/50"}`}>
      <div className="sm:grid sm:grid-cols-12 sm:gap-x-4 items-center">

        {/* Product info */}
        <div className="sm:col-span-6 flex items-start gap-4">
          {/* Image */}
          <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-100 relative bg-neutral-100">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.description}</p>

            {/* Farm + location */}
            <div className="flex items-center gap-1 mt-1.5">
              <span className="material-symbols-outlined text-primary-dark text-xs"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                storefront
              </span>
              <span className="text-xs font-medium text-primary-dark">{product.farm.name}</span>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {location}
            </p>

            {/* Mobile remove */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="mt-2 text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1 sm:hidden"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Remove
            </button>
          </div>
        </div>

        {/* Quantity stepper */}
        <div className="mt-4 sm:mt-0 sm:col-span-3 flex flex-col items-center gap-1">
          <div className={`flex items-center border rounded-lg overflow-hidden transition-opacity ${isUpdating ? "opacity-50" : ""} ${item.quantity >= product.stock ? "border-orange-300" : "border-gray-200"}`}>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isUpdating || item.quantity <= 1}
              className="px-2.5 py-2.5 text-gray-500 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <span className="material-symbols-outlined text-base">remove</span>
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={handleInput}
              disabled={isUpdating}
              min={1}
              max={product.stock}
              className="w-12 text-center py-2 text-sm font-bold text-gray-900 bg-transparent border-x border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={handleIncrement}
              disabled={isUpdating || item.quantity >= product.stock}
              className="px-2.5 py-2.5 text-gray-500 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
              aria-label="Increase quantity"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>
          </div>

          {item.quantity >= product.stock && (
            <p className="text-xs text-orange-500 font-medium">Max stock</p>
          )}

          <p className="text-xs text-gray-400">
            {unitPrice.toLocaleString("fr-DZ")} DZD / unit
          </p>
        </div>

        {/* Subtotal + desktop remove */}
        <div className="mt-4 sm:mt-0 sm:col-span-3 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
          <div className="text-right">
            <p className="text-base font-bold text-gray-900">
              {subtotal.toLocaleString("fr-DZ")}
              <span className="text-xs font-normal text-gray-400 ml-1">DZD</span>
            </p>
            {isUpdating && (
              <span className="material-symbols-outlined animate-spin text-sm text-primary-dark">
                progress_activity
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
            className="hidden sm:flex text-gray-300 hover:text-red-400 transition-colors disabled:opacity-40"
            aria-label="Remove item"
          >
            <span className="material-symbols-outlined text-xl">delete_outline</span>
          </button>
        </div>

      </div>
    </div>
  );
}