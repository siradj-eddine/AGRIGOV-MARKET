"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface Props {
  label: string;
  hint?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}

export default function FileUpload({
  label,
  hint = "PDF, PNG, JPG up to 10 MB",
  file,
  onChange,
  accept = ".pdf,.png,.jpg,.jpeg",
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] ?? null);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-gray-700">{label}</p>

      {file ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/50 bg-primary/5">
          <span
            className="material-symbols-outlined text-primary-dark text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            insert_drive_file
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove file"
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Upload ${label}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 bg-gray-50 hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          <span
            className={`material-symbols-outlined text-3xl transition-colors ${
              isDragging ? "text-primary" : "text-gray-400"
            }`}
          >
            cloud_upload
          </span>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-primary-dark">Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-gray-400">{hint}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  );
}