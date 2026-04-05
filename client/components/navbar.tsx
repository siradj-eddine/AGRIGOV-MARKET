"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROLE_LINKS, UserRole } from "@/types/roles";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function Navbar() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userCookie = getCookie("role");
    if (userCookie) setRole(userCookie as UserRole);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const links = role ? ROLE_LINKS[role] : [];

  const handleLogout = () => {
    document.cookie = "access=; Max-Age=0; path=/";
    document.cookie = "role=; Max-Age=0; path=/";
    router.push("/Login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-neutral-900 text-xl">agriculture</span>
              </div>
              <span className="font-bold text-lg text-neutral-900 dark:text-white flex items-center">
                AGRIGOV
                <span className="hidden sm:block text-[10px] font-normal text-neutral-500 uppercase tracking-widest ml-2 border-l border-neutral-300 pl-2">
                  National Platform
                </span>
              </span>
            </Link>
          </div>

          {/* 2. Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 h-full">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors h-full ${
                  pathname === link.href
                    ? "border-primary text-neutral-900 dark:text-white"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:border-neutral-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 3. Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none relative transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2.5 right-2.5 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900" />
            </button>

            <div className="hidden sm:flex items-center gap-3 border-l border-neutral-200 dark:border-neutral-700 pl-4">
              <Image src="/avatar.png" alt="Profile" width={32} height={32} className="h-8 w-8 rounded-full ring-2 ring-primary/10" />
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-semibold text-neutral-900 dark:text-white uppercase">{role ?? "User"}</span>
                <button onClick={handleLogout} className="text-[10px] text-red-500 font-bold hover:underline text-left">LOGOUT</button>
              </div>
            </div>

            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile Menu Drawer */}
      <div 
        className={`md:hidden absolute w-full bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-0 invisible h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1 shadow-xl">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                pathname === link.href
                  ? "bg-primary/10 text-primary-dark"
                  : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3 px-4 py-2">
              <Image src="/avatar.png" alt="Profile" width={36} height={36} className="rounded-full" />
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white uppercase">{role ?? "Guest"}</p>
                <p className="text-xs text-neutral-500">Official Account</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full mt-2 flex items-center gap-2 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              Logout Session
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}