import type { PaymentMethod } from '@/types/Profile';

interface SettlementAccountsCardProps {
  methods:      PaymentMethod[];
  onAddMethod:  () => void;
}

export default function SettlementAccountsCard({
  methods,
  onAddMethod,
}: SettlementAccountsCardProps) {
  return (
    <section className="md:col-span-6 bg-background-light dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10 border-t-4 border-t-primary">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">
            Settlement Accounts
          </h3>
          <p className="text-sm text-slate-500">For subsidy and market payouts</p>
        </div>
        <span className="material-symbols-outlined text-slate-400">account_balance</span>
      </div>

      {/* Payment method list */}
      <div className="space-y-3 mb-6">
        {methods.map((method) => (
          <div
            key={method.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-neutral-light dark:border-slate-700 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                Primary Payout Method
              </p>
              <p className="text-slate-900 dark:text-slate-100 font-bold truncate">
                {method.label}
              </p>
            </div>
            {method.isPrimary && (
              <span className="material-symbols-outlined text-primary text-xl shrink-0">
                check_circle
              </span>
            )}
          </div>
        ))}

        {/* Empty state */}
        {methods.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4 font-medium">
            No payment methods added yet.
          </p>
        )}
      </div>

      {/* Add method */}
      <button
        onClick={onAddMethod}
        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-bold text-sm uppercase flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-all"
      >
        <span className="material-symbols-outlined">add</span>
        Add New Payment Method
      </button>
    </section>
  );
}