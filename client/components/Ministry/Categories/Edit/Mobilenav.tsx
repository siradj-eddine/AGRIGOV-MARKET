import { MOBILE_NAV } from '@/types/EditCategory';

export default function CategoryEditMobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md h-16 flex items-center justify-around z-50 border-t border-primary/10"
    >
      {MOBILE_NAV.map((item) => (
        <button
          key={item.label}
          aria-label={item.label}
          aria-current={item.active ? 'page' : undefined}
          className={`flex flex-col items-center gap-1 ${
            item.active ? 'text-primary' : 'text-slate-400'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {item.icon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}