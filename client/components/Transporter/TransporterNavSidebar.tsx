"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { profileApi } from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}

export default function TransporterNavSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Driver");
  const [userEmail, setUserEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await profileApi.me();
        // Your API returns: { status: "success", code: 200, data: { user: {...}, profile: {...}, extras: {...} } }
        const user = data.data?.user;
        
        if (user) {
          setUserName(user.username || user.email?.split('@')[0] || "Driver");
          setUserEmail(user.email || "");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    router.push("/Login");
  };

  const navItems: NavItem[] = [
    { href: "/Transporter/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/Transporter/dashboard/missions", label: "Missions", icon: "local_shipping" },
    
  ];



  const isActive = (href: string) => {
    if (href === "/Transporter/dashboard" && pathname === "/Transporter/dashboard") return true;
    if (href === "/Transporter/dashboard/missions" && pathname === "/Transporter/dashboard/missions") return true;
    return false;
  };

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-background-dark border-r border-primary/20 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-background-dark shrink-0">
            <span className="material-symbols-outlined font-bold">local_shipping</span>
          </div>
          <div>
            <h1 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
              Transporter Hub
            </h1>
            <p className="text-primary text-xs font-medium">Logistics Management</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto" aria-label="Transporter navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.href)
                ? "bg-primary/20 text-slate-900 dark:text-slate-100 border border-primary/30"
                : "text-slate-600 dark:text-slate-400 hover:bg-primary/10"
            }`}
          >
            <span
              className={`material-symbols-outlined ${isActive(item.href) ? "text-primary" : ""}`}
            >
              {item.icon}
            </span>
            <span className={`text-sm ${isActive(item.href) ? "font-bold" : "font-medium"}`}>
              {item.label}
            </span>
          </Link>
        ))}

        {/* Divider */}
        <div className="pt-4 mt-4 border-t border-primary/10" />

        {/* Bottom Navigation */}
      
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-primary/10">
        <div className="flex items-center gap-3 px-2 py-3 bg-primary/5 rounded-xl">
          <div className="size-10 rounded-full overflow-hidden relative shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="User avatar"
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">{loading ? "Loading..." : userName}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider truncate">
              {loading ? "..." : userEmail || "Transporter"}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}