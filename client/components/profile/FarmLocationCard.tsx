import Image from 'next/image';
import type { FarmLocation } from '@/types/Profile';

interface FarmLocationCardProps {
  location:         FarmLocation;
  onVerifyBoundaries: () => void;
}

export default function FarmLocationCard({
  location,
  onVerifyBoundaries,
}: FarmLocationCardProps) {
  return (
    <section className="md:col-span-4 bg-background-light dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Farm Location</h3>
        <span className="material-symbols-outlined text-primary">location_on</span>
      </div>

      {/* Map thumbnail */}
      <div className="w-full h-40 rounded-xl overflow-hidden mb-4 relative shrink-0">
        <Image
          src={location.mapImageUrl}
          alt="Satellite view of farm fields in the Northern Midlands"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover grayscale opacity-80"
        />
        {/* Overlay tint */}
        <div className="absolute inset-0 bg-primary/10" />
        {/* Location pin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Estate</p>
          <p className="text-slate-900 dark:text-slate-100 font-semibold">{location.estate}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Region</p>
          <p className="text-slate-900 dark:text-slate-100 font-semibold">{location.region}</p>
        </div>
        <button
          onClick={onVerifyBoundaries}
          className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-neutral-light dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined text-base">map</span>
          Verify Boundaries
        </button>
      </div>
    </section>
  );
}