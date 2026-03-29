import type { SecuritySetting } from '@/types/Profile';

interface AccountSecurityCardProps {
  settings:          SecuritySetting[];
  onToggle:          (id: string) => void;
  onLinkAction:      (id: string) => void;
  onChangePassword:  () => void;
  onDeactivate:      () => void;
}

export default function AccountSecurityCard({
  settings,
  onToggle,
  onLinkAction,
  onChangePassword,
  onDeactivate,
}: AccountSecurityCardProps) {
  return (
    <section className="md:col-span-6 bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">Account Security</h3>
        <span className="material-symbols-outlined text-slate-400">shield_lock</span>
      </div>

      <div className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between">
            <div className="space-y-1 mr-4">
              <p className="text-slate-900 dark:text-slate-100 font-semibold">{setting.label}</p>
              <p className="text-xs text-slate-500">{setting.description}</p>
            </div>

            {setting.type === 'toggle' ? (
              <button
                role="switch"
                aria-checked={setting.enabled}
                aria-label={`Toggle ${setting.label}`}
                onClick={() => onToggle(setting.id)}
                className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${
                  setting.enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    setting.enabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            ) : (
              <button
                onClick={() => onLinkAction(setting.id)}
                className="text-primary text-xs font-bold uppercase hover:underline shrink-0"
              >
                {setting.linkLabel}
              </button>
            )}
          </div>
        ))}

        {/* Action buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
          <button
            onClick={onChangePassword}
            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-neutral-light dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">key</span>
            Change Password
          </button>
          <button
            onClick={onDeactivate}
            className="flex-1 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">no_accounts</span>
            Deactivate
          </button>
        </div>
      </div>
    </section>
  );
}