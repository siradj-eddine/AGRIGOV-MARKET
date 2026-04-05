import Image from 'next/image';
import { useRef } from 'react';
import type { ProductImage } from '@/types/ProductEdit';

interface ProductGalleryCardProps {
  images:        ProductImage[];
  onEditPrimary: () => void;
  /** Called with the selected File so the parent can track new uploads */
  onAddImage:    (file: File, previewSrc: string) => void;
}

export default function ProductGalleryCard({
  images,
  onEditPrimary,
  onAddImage,
}: ProductGalleryCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const primary = images.find((img) => img.isPrimary);
  const thumbs  = images.filter((img) => !img.isPrimary);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const previewSrc = ev.target?.result as string;
      onAddImage(file, previewSrc);
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10 overflow-hidden">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">image</span>
        Product Gallery
      </h3>

      <div className="grid grid-cols-4 gap-4">
        {/* Primary image */}
        <div className="col-span-4 md:col-span-3 relative group overflow-hidden rounded-xl h-64">
          {primary && (
            <Image
              src={primary.src}
              alt={primary.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
            />
          )}
          <div
            className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"
            aria-hidden="true"
          />
          <button
            onClick={onEditPrimary}
            aria-label="Edit primary product image"
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-slate-700">edit</span>
          </button>
        </div>

        {/* Thumbnail column */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Existing thumbs */}
          {thumbs.slice(0, 1).map((thumb) => (
            <div key={thumb.id} className="flex-1 rounded-xl overflow-hidden relative min-h-28">
              <Image
                src={thumb.src}
                alt={thumb.alt}
                fill
                sizes="100px"
                className="object-cover"
              />
              {thumb.file && (
                <span className="absolute bottom-1 left-1 bg-primary text-[9px] font-black text-slate-900 px-1 rounded">
                  NEW
                </span>
              )}
            </div>
          ))}

          {/* Add image slot */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-h-28 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all bg-background-light dark:bg-slate-800"
            aria-label="Add new product image"
          >
            <span className="material-symbols-outlined text-3xl">add_a_photo</span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Add Image</span>
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={handleFileChange}
      />
    </section>
  );
}