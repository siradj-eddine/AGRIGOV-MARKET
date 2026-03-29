import Image from 'next/image';
import type { FarmerProfile } from '@/types/Profile';

interface PersonalDetailsCardProps {
  profile:   FarmerProfile;
  onChange:  (field: keyof FarmerProfile, value: string) => void;
  onEditAvatar: () => void;
}

export default function PersonalDetailsCard({
  profile,
  onChange,
  onEditAvatar,
}: PersonalDetailsCardProps) {
  return (
    <section className="md:col-span-8 bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10 relative overflow-hidden">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

      {/* Avatar + name row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-10">
        <div className="relative group shrink-0">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
            <Image
              src={profile.avatarUrl}
              alt="User Profile"
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          </div>
          <button
            onClick={onEditAvatar}
            aria-label="Edit profile photo"
            className="absolute bottom-0 right-0 p-2 bg-primary text-slate-900 rounded-full shadow-md hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {profile.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-primary/20 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {profile.role}
            </span>
            <span className="text-slate-400 text-sm">•</span>
            <span className="text-slate-500 text-sm font-medium">
              Member since {profile.memberSince}
            </span>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-slate-500 text-xs font-bold uppercase tracking-wider"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-slate-500 text-xs font-bold uppercase tracking-wider"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="bio"
            className="block text-slate-500 text-xs font-bold uppercase tracking-wider"
          >
            Bio / Management Style
          </label>
          <textarea
            id="bio"
            rows={3}
            value={profile.bio}
            onChange={(e) => onChange('bio', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
          />
        </div>
      </div>
    </section>
  );
}