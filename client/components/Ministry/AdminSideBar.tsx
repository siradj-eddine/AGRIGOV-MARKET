import Image from "next/image";
import Link from "next/link";
import type { AdminNavItem } from "@/types/Ministry";

interface Props {
  items: AdminNavItem[];
}

export default function AdminSidebar({ items }: Props) {
  // Group items — collect section headers before their items
  const renderedSections = new Set<string>();

  return (
    <aside className="w-64 min-h-screen bg-secondary-dark dark:bg-black text-white flex flex-col shadow-xl z-50 shrink-0 md:flex">
      {/* Logo */}
      <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
        <div className="bg-primary/20 p-2 rounded-lg">
          <span className="material-icons text-primary">agriculture</span>
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">AgriMinistry</h1>
          <p className="text-xs text-slate-400">National Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {items.map((item) => {
          const showSection = item.section && !renderedSections.has(item.section);
          if (item.section) renderedSections.add(item.section);

          return (
            <div key={item.label}>
              {showSection && (
                <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {item.section}
                </div>
              )}
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  item.active
                    ? "bg-primary/20 text-primary"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="material-icons">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDySDX0-R8DW4b0KFaJG8HO66QiDQCebdLeCvJcHiVNosUzVYOa8GO-e_PRB4F-f8YNliMOGpfymU48LwOfD9on6NIuEoGn_T6OLKmSy_FHQa4E1PKgaFxr0IUENehF1ArNg88GeHBRx7r9lm91k-dm-hRgKm5qxfEOMbRsTqqcHezl9PWxvxGfHEwdAzWUUd781RD9GlltwgP5zPUc4FZAemaKa0U3WICuhqhkMlX8Jf8RGE0Ghg3Bmx91UFOnMx6idib-Gthio1En"
              alt="Admin profile"
              fill
              className="rounded-full object-cover bg-slate-600"
              sizes="40px"
            />
          </div>
          <div>
            <p className="text-sm font-medium">Dr. A. Osei</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}