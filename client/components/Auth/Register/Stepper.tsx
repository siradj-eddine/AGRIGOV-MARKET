import type { RegistrationStep } from "@/types/Register";
import { STEPS, STEP_PROGRESS } from "@/types/Register";

interface Props {
  currentStep: RegistrationStep;
}

export default function FormStepper({ currentStep }: Props) {
  const progressPct = STEP_PROGRESS[currentStep];

  return (
    <div className="bg-gray-50 px-6 py-6 border-b border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
        <span className="text-sm font-medium text-gray-500">
          Step {currentStep} of {STEPS.length}
        </span>
      </div>

      <div className="overflow-hidden h-2 mb-4 rounded bg-gray-200">
        <div
          className="h-full bg-primary rounded transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs font-medium">
        {STEPS.map(({ step, label }) => (
          <span
            key={step}
            className={step <= currentStep ? "text-primary-dark" : "text-gray-400"}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}