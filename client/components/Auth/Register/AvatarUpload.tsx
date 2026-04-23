"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function AvatarUpload({ file, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview,    setPreview]    = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    onChange(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="md:col-span-2 space-y-1.5">
      <p className="text-sm font-medium text-gray-700">
        Profile Photo <span className="text-red-500">*</span>
      </p>

      <div className="flex items-center gap-5">
        {/* Avatar circle */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
            {preview ? (
              <Image
                src={preview}
                alt="Profile preview"
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-gray-300 text-4xl">person</span>
            )}
          </div>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove photo"
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[13px]">close</span>
            </button>
          )}
        </div>

        {/* Drop zone / file info */}
        {file ? (
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/50 bg-primary/5">
            <span
              className="material-symbols-outlined text-primary-dark text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              insert_photo
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove photo"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload profile photo"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-4 cursor-pointer transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 bg-gray-50 hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <span className={`material-symbols-outlined text-2xl transition-colors ${isDragging ? "text-primary" : "text-gray-400"}`}>
              add_a_photo
            </span>
            <p className="text-sm text-gray-500 text-center">
              <span className="font-medium text-primary-dark">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-gray-400">PNG or JPG, up to 5 MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  );
}