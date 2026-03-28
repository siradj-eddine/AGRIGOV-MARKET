import Image from "next/image";
import Link from "next/link";
import { sidebarLinks, FARM_LOGO_URL } from "@/types/AddProduct";

export default function FarmerSidebar() {
  return (
    <aside className="w-64 border-r border-primary/10 bg-white dark:bg-background-dark/50 hidden md:flex flex-col">
      <div className="p-6 flex flex-col h-full">
        {/* Farm identity */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0 relative">
            <Image
              src={FARM_LOGO_URL}
              alt="Green Acres Farm logo"
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-slate-100 text-sm font-bold">
              Green Acres Farm
            </h1>
            <p className="text-primary text-xs font-medium">Verified Producer</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                link.active
                  ? "bg-primary/20 text-slate-900 dark:text-slate-100"
                  : "hover:bg-primary/10"
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  link.active ? "text-primary" : "text-slate-500"
                }`}
              >
                {link.icon}
              </span>
              <span className={`text-sm ${link.active ? "font-bold" : "font-medium"}`}>
                {link.label}
              </span>
            </Link>
          ))}

          <div className="my-4 border-t border-primary/5" />

          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6 border-t border-primary/5">
          <button
            type="button"
            className="flex items-center gap-3 px-3 py-2 w-full text-slate-500 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}