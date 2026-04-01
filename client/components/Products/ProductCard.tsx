"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ApiProduct } from "@/types/Product";
import { SEASON_LABELS, SEASON_ICONS } from "@/types/Product";

interface Props {
  product: ApiProduct;
}

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80";

/** Grade badge colour derived from product rating */
function gradeInfo(rating: string | null): { label: string; cls: string } {
  const r = parseFloat(rating ?? "0");
  if (r >= 4.5) return { label: "Grade A+", cls: "bg-primary text-black"       };
  if (r >= 4.0) return { label: "Grade A",  cls: "bg-primary text-black"       };
  if (r >= 3.0) return { label: "Grade B",  cls: "bg-yellow-400 text-black"    };
  return             { label: "Grade C",  cls: "bg-neutral-400 text-white"   };
}

export default function ProductCard({ product }: Props) {
  const [liked, setLiked] = useState(false);
  const imageUrl = product.images[0]?.image ?? PLACEHOLDER;  
  const price    = parseFloat(product.unit_price);
  const rating   = parseFloat(product.average_rating ?? "0");
  const grade    = gradeInfo(product.average_rating);
  const farmName = product.farm?.farm_name ?? "Unknown Farm";
  const location = [product.farm?.wilaya, product.farm?.baladiya].filter(Boolean).join(", ");

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100 overflow-hidden flex flex-col">

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        {/* Grade badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm ${grade.cls}`}>
          {grade.label}
        </div>

        {/* Stock badge */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Favourite */}
        <button
          onClick={() => setLiked((v) => !v)}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm"
        >
          <span
            className={`material-symbols-outlined text-lg ${liked ? "text-red-500" : "text-neutral-400 hover:text-red-400"}`}
            style={liked ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-primary-dark uppercase tracking-wider">
            {product.category.name}
          </span>
          {product.average_rating && (
            <span className="flex items-center gap-0.5 text-xs text-neutral-500">
              <span
                className="material-symbols-outlined text-yellow-400 text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-neutral-900 mb-1 leading-snug">
          {product.title}
        </h3>
        <p className="text-sm text-neutral-500 mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto">
          {/* Farm + season */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100 mb-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-neutral-400 text-sm shrink-0">
                location_on
              </span>
              <span className="text-xs text-neutral-500 truncate">{location || farmName}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-400 shrink-0 ml-2">
              <span className="material-symbols-outlined text-sm">{SEASON_ICONS[product.season]}</span>
              <span>{SEASON_LABELS[product.season]}</span>
            </div>
          </div>

          {/* Stock pill */}
          {product.in_stock && (
            <p className="text-xs text-neutral-400 mb-3">
              <span className="font-medium text-neutral-700">{product.stock}</span> units available
            </p>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-neutral-400">Unit price</p>
              <p className="text-lg font-bold text-neutral-900">
                {price.toLocaleString("fr-DZ")} <span className="text-sm font-normal text-neutral-400">DZD</span>
              </p>
            </div>
            <Link
              href={`/marketplace/${product.id}`}
              className={`text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-all whitespace-nowrap ${
                product.in_stock
                  ? "bg-primary hover:bg-primary-dark text-black"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed pointer-events-none"
              }`}
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}