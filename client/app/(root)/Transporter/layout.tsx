// app/(root)/Transporter/layout.tsx
"use client";

import { useState } from "react";
import TransporterNavSidebar from "@/components/Transporter/TransporterNavSidebar";
import { usePathname } from "next/navigation";

export default function TransporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMissionSidebarOpen, setIsMissionSidebarOpen] = useState(true);

  // Check if we're on the missions page to show the toggle button
  const isMissionsPage = pathname?.includes("/missions");

  return (
    <div className="bg-background-light dark:bg-background-dark h-screen flex overflow-hidden">
      {/* Navigation Sidebar - ALWAYS visible */}
      <TransporterNavSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex overflow-y-auto relative">
          {/* Children pages will render here */}
          {children}
        </main>
      </div>
    </div>
  );
}