"use client";

import Image from "next/image";
import { USER_AVATAR_URL } from "@/types/AddProduct";

interface Props {
  onMenuToggle: () => void;
}

export default function AddProductHeader({ onMenuToggle }: Props) {
  return (
    <header className="h-16 border-b border-primary/10 bg-white dark:bg-background-dark/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuToggle}
          className="md:hidden p-2 text-slate-500"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">add_circle</span>
          <h2 className="text-lg font-bold tracking-tight">Add New Product</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-primary/10 relative"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark" />
        </button>

        <div className="relative w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-primary/20 shrink-0">
          <Image
            src={USER_AVATAR_URL}
            alt="User avatar"
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      </div>
    </header>
  );
}