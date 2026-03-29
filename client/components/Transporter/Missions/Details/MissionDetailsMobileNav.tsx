import { MOBILE_NAV } from '@/types/MissionDetails';

export default function MissionDetailMobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl h-20 flex items-center justify-around px-4 z-50 border-t border-primary/10 shadow-sm"
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