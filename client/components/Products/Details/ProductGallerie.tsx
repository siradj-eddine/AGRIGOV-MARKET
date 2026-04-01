"use client";

import Image from "next/image";
import { useState } from "react";
import type { ApiImage } from "@/types/Product";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80";

interface Props {
  images:     ApiImage[];
  title:      string;
  inStock:    boolean;
  rating:     string | null;
}

export default function ProductGallery({ images, title, inStock, rating }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  const displayImages = images.length > 0
    ? images
    : [{ id: 0, image: PLACEHOLDER }];

  const active = displayImages[activeIdx];

  return (
    <div className="bg-white rounded-xl p-2 shadow-sm border border-neutral-100">
      {/* Main image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 mb-3 group">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          {!inStock && (
            <span className="bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
          {rating && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <span
                className="material-symbols-outlined text-yellow-400 text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              {parseFloat(rating).toFixed(1)}
            </span>
          )}
        </div>

        <Image
          key={active.id}
          src={active.image}
          alt={`${title} — image ${activeIdx + 1}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 px-2 pb-2 overflow-x-auto">
          {displayImages.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden transition-all ${
                activeIdx === i
                  ? "ring-2 ring-primary ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.image} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}