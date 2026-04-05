"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import DashboardSidebar from "@/components/Inventory/ProductsSidebar";
import { FARMER_NAV } from "@/types/Inventory";

export default function FarmerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex">
      {/* 1. Desktop Sidebar */}
      <DashboardSidebar farmName="Green Valley Farm" />

      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Main Content Area 
            Added pb-20 on mobile to prevent the Bottom Nav from covering content.
        */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 pb-24 lg:pb-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        {/* 3. Mobile Bottom Navigation 
            Only visible on small screens. Positioned at the very bottom.
        */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-primary/10 flex items-center justify-around px-2 z-50">
          {FARMER_NAV.slice(0, 4).map((item) => { // Limit to top 4 for spacing
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
                  active ? "text-primary scale-110" : "text-slate-400 opacity-70"
                }`}
              >
                <span className="material-symbols-outlined text-2xl" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Mobile "More" or Profile trigger */}
          <Link href="/farmer/profile" className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-400">
             <span className="material-symbols-outlined text-2xl">account_circle</span>
             <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}