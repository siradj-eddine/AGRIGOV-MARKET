import type { QualityMetric } from '@/types/EditCategory';

interface QualityMetricsCardProps {
  metrics:     QualityMetric[];
  onAddMetric: () => void;
}

export default function QualityMetricsCard({ metrics, onAddMetric }: QualityMetricsCardProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-primary/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">monitoring</span>
          Quality Metrics
        </h3>
        <button
          onClick={onAddMetric}
          className="text-primary font-bold text-sm hover:underline"
        >
          + Add Metric
        </button>
      </div>

      <div className="space-y-8">
        {metrics.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4 font-medium">
            No quality metrics defined yet.
          </p>
        ) : (
          metrics.map((metric) => (
            <div key={metric.id} className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{metric.name}</p>
                  <p className="text-xs text-slate-500 uppercase">{metric.limit}</p>
                </div>
                <span className={`font-black ${metric.valueClass}`}>{metric.value}</span>
              </div>
              <div className="h-3 w-full bg-neutral-light dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${metric.barClass} rounded-full transition-all duration-700`}
                  style={{ width: `${metric.barPercent}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}