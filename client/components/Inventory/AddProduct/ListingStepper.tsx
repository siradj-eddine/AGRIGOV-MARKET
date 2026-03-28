import type { ListingStep } from "@/types/AddProduct";
import { LISTING_STEPS } from "@/types/AddProduct";

interface Props {
  currentStep: ListingStep;
}

export default function ListingStepper({ currentStep }: Props) {
  const total = LISTING_STEPS.length;
  const pct = Math.round(((currentStep - 1) / (total - 1)) * 100);
  const stepLabel = LISTING_STEPS.find((s) => s.step === currentStep)?.label ?? "";

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Step {currentStep} of {total}: {stepLabel}
        </span>
        <span className="text-sm font-bold text-primary">{pct}% Complete</span>
      </div>
      <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}