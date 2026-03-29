import Image from 'next/image';
import type { MapStat } from '@/types/MissionDetails';

interface MissionMapCardProps {
  imageUrl:    string;
  imageAlt:    string;
  stats:       MapStat[];
  onNavigate:  () => void;
}

export default function MissionMapCard({
  imageUrl,
  imageAlt,
  stats,
  onNavigate,
}: MissionMapCardProps) {
  return (
    <section className="bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm relative min-h-100">
      {/* Satellite image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover opacity-80 mix-blend-multiply dark:mix-blend-normal"
          priority
        />
      </div>

      {/* Route overlay — decorative SVG dashed line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 400"
        aria-hidden="true"
      >
        <path
          d="M300,200 Q600,100 900,300"
          fill="none"
          stroke="#0df20d"
          strokeDasharray="8 4"
          strokeWidth="4"
        />
      </svg>

      {/* Origin pin */}
      <div
        className="absolute top-1/2 left-1/4 w-3 h-3 bg-primary rounded-full ring-4 ring-white"
        aria-hidden="true"
      />
      {/* Destination pin */}
      <div
        className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-slate-800 rounded-full ring-4 ring-white"
        aria-hidden="true"
      />

      {/* Stat pills */}
      <div className="absolute top-4 left-4 flex gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-primary text-sm">
              {stat.icon}
            </span>
            <span className="text-sm font-bold">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Navigate FAB */}
      <button
        onClick={onNavigate}
        aria-label="Open navigation"
        className="absolute bottom-4 right-4 bg-primary text-slate-900 p-4 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined">navigation</span>
      </button>
    </section>
  );
}