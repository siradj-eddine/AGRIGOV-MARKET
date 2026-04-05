interface Props {
  percent:   number;
  items:     { label: string; done: boolean }[];
}

const R = 40;
const C = 2 * Math.PI * R;

export default function ProfileCompletionGauge({ percent, items }: Props) {
  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl p-8 border border-primary/10 shadow-sm flex flex-col md:flex-row items-center gap-10">
      {/* SVG ring */}
      <div className="relative w-24 h-24 shrink-0">
        <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r={R} fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
          <circle
            cx="48" cy="48" r={R} fill="transparent"
            stroke="currentColor" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - percent / 100)}
            className="text-primary transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black text-slate-900 dark:text-slate-100">{percent}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 text-center md:text-left">
        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Profile Strength</h4>
        <p className="text-sm text-slate-500 mb-4">
          {percent < 100
            ? "Complete your profile to unlock all platform features."
            : "Your profile is fully complete. Great work!"}
        </p>
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {items.map((item) => (
            <span
              key={item.label}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                item.done
                  ? "bg-primary/20 text-primary-dark"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "12px", fontVariationSettings: item.done ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.done ? "check_circle" : "radio_button_unchecked"}
              </span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}