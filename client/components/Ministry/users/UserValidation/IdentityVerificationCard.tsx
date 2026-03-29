import Image from 'next/image';
import type { IdentityDetail } from '@/types/UserValidation';

interface IdentityVerificationCardProps {
  idCardUrl:      string;
  details:        IdentityDetail[];
  selfieVerified: boolean;
  onViewFullScreen: () => void;
}

export default function IdentityVerificationCard({
  idCardUrl,
  details,
  selfieVerified,
  onViewFullScreen,
}: IdentityVerificationCardProps) {
  return (
    <div className="bg-background-light dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-primary/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">fingerprint</span>
          Identity Verification
        </h3>
        {selfieVerified && (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/20 text-primary uppercase tracking-tight">
            Selfie Verified
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ID card image */}
        <div className="group relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-700 aspect-video border border-primary/10">
          <Image
            src={idCardUrl}
            alt="Government-issued photo identification card"
            fill
            sizes="(min-width: 1024px) 30vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onViewFullScreen}
              className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <span className="material-symbols-outlined text-sm">fullscreen</span>
              View Full Screen
            </button>
          </div>
          {/* Label chip */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
            National ID
          </div>
        </div>

        {/* Details panel */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl flex flex-col justify-center space-y-4 border border-primary/5">
          {details.map((d) => (
            <div key={d.label}>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                {d.label}
              </label>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{d.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}