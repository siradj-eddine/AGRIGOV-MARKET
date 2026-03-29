import Image from 'next/image';
import type { QualityStandard } from '@/types/AddOfficialPrice';

interface QualityStandardsCardProps {
  imageUrl:   string;
  standards:  QualityStandard[];
}

export default function QualityStandardsCard({ imageUrl, standards }: QualityStandardsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-primary/10 shadow-sm">
      {/* Hero image */}
      <div className="h-48 relative overflow-hidden">
        <Image
          src={imageUrl}
          alt="Golden harvested wheat stalks with warm cinematic lighting"
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-white dark:from-slate-900 to-transparent" />
      </div>

      {/* Standards panel */}
      <div className="p-8 -mt-12 relative z-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm space-y-4 border border-primary/10">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Quality Standards</h3>
          <div className="space-y-4">
            {standards.map((std, i) => (
              <div
                key={std.label}
                className={`flex justify-between items-center pb-2 ${
                  i < standards.length - 1 ? 'border-b border-primary/10' : ''
                }`}
              >
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{std.label}</span>
                <span className="font-bold text-primary">{std.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}