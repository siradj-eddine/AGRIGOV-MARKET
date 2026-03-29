import type { ProfileBadge } from '@/types/Profile';

interface ProfileCompletionGaugeProps {
  percent:         number;  // 0–100
  badges:          ProfileBadge[];
  onCompleteProfile: () => void;
}

// SVG ring constants
const RADIUS    = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 251.33

export default function ProfileCompletionGauge({
  percent,
  badges,
  onCompleteProfile,
}: ProfileCompletionGaugeProps) {
  const dashOffset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <div className="mt-12 bg-background-light dark:bg-slate-900 rounded-2xl p-8 border border-primary/10 shadow-sm flex flex-col md:flex-row items-center gap-10">
      {/* SVG Gauge */}
      <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 96 96"
          className="w-full h-full -rotate-90"
          aria-label={`Profile ${percent}% complete`}
          role="img"
        >
          {/* Track */}
          <circle
            cx="48"
            cy="48"
            r={RADIUS}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-neutral-light dark:text-slate-700"
          />
          {/* Fill */}
          <circle
            cx="48"
            cy="48"
            r={RADIUS}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="text-primary transition-all duration-700"
          />
        </svg>
        {/* Label — counter-rotated so it reads upright */}
        <div className="absolute inset-0 flex items-center justify-center rotate-0">
          <span className="text-xl font-black text-slate-900 dark:text-slate-100">
            {percent}%
          </span>
        </div>
      </div>

      {/* Copy */}
      <div className="flex-1 text-center md:text-left">
        <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Profile Strength</h4>
        <p className="text-slate-500 mb-4">
          Complete your identity verification to unlock higher subsidy tier eligibility.
        </p>
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {badges.map((badge) => (
            <span
              key={badge.id}
              className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                badge.verified
                  ? 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                  : 'bg-primary/20 text-slate-700 dark:text-slate-300 uppercase tracking-widest'
              }`}
            >
              {badge.verified && (
                <span className="material-symbols-outlined text-[12px] text-primary">check</span>
              )}
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onCompleteProfile}
        className="px-8 py-4 bg-slate-900 dark:bg-primary text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity shrink-0"
      >
        Complete Profile
      </button>
    </div>
  );
}