import Link from 'next/link';
import Image from 'next/image';
import { NAV_ITEMS } from '@/types/UserManagement';

export default function UserManagementSidebar() {
  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark h-full">
      <div className="p-6 flex flex-col gap-6 h-full">
        {/* Logo */}
        <div className="flex gap-3 items-center">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden relative shrink-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiX9qQQRE8of-CTCxGfmeQwoL8DIBm_PJkcjCAebXaDlyHfagkOIZUTkmsvJeEwiz5cOLj-3AswOqjppiQyh9AeihAZXeWyPUEMGw0TpTFkdjJS8e38aYRkA-puPjYro7gyO82tY0iMH_IkQ0b5nWhyWHA2wcAkgfWzgnmJLoVYNB23HyRY4M6F6IFVFl8aqkZMDf38KnQm1zV65lnIaNOVfjlCNNlkYtNnLySI2pLQOgayEjb0QkUKAMetVl-nZT5PaUfF4YoMzcp"
              alt="Ministry of Agriculture Official Logo"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-slate-100 text-sm font-bold leading-tight">
              Ministry Admin
            </h1>
            <p className="text-primary text-xs font-medium">Agriculture Dept.</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 grow" aria-label="Admin navigation">
          {NAV_ITEMS.filter((item) => item.label !== 'Settings').map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={
                item.active
                  ? 'flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary transition-colors'
                  : 'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span
                className={`material-symbols-outlined ${
                  item.active ? '' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Settings pushed to bottom */}
          <div className="mt-auto">
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                settings
              </span>
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </div>
        </nav>

        {/* System Status Banner */}
        <div className="mt-4 p-3 rounded-lg bg-primary text-slate-900 text-center text-xs font-bold uppercase tracking-wider">
          System Status: Active
        </div>
      </div>
    </aside>
  );
}