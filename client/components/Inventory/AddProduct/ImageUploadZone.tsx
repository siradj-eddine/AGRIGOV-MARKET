"use client";

import Image from "next/image";
import { useRef, useState, DragEvent, ChangeEvent } from "react";
import type { UploadedImage } from "@/types/AddProduct";

interface Props {
  images: UploadedImage[];
  onAdd: (img: UploadedImage) => void;
  onRemove: (id: string) => void;
}

export default function ImageUploadZone({ images, onAdd, onRemove }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      onAdd({ id: `img-${Date.now()}`, src, alt: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold">Product Images</label>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload product image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-primary/20 bg-primary/5 hover:bg-primary/10"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-primary text-3xl">add_a_photo</span>
        </div>
        <p className="text-sm font-medium">Click or drag images to upload</p>
        <p className="text-xs text-slate-400 mt-1">PNG, JPG or JPEG (Max 5MB)</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={handleChange}
      />

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex gap-4 mt-4 flex-wrap">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-primary/20 group shrink-0"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
              <button
                type="button"
                onClick={() => onRemove(img.id)}
                aria-label={`Remove ${img.alt}`}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          ))}

          {/* Add more slot */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Add another image"
            className="w-20 h-20 rounded-lg border border-primary/20 border-dashed flex items-center justify-center text-slate-300 hover:border-primary hover:text-primary transition-colors shrink-0"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      )}
    </div>
  );
}