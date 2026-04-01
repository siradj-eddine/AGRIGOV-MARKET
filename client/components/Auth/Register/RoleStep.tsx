import type { RegisterRole } from "@/types/Register";
import { ROLE_ICONS, ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/types/Register";

const ROLES: RegisterRole[] = ["FARMER", "BUYER", "TRANSPORTER"];

interface Props {
  selected: RegisterRole;
  onSelect: (role: RegisterRole) => void;
}

export default function RoleStep({ selected, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Role</h3>
        <p className="text-gray-500">
          Choose the account type that best describes your role on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ROLES.map((role) => {
          const active = selected === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onSelect(role)}
              aria-pressed={active}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 text-center transition-all ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  active ? "bg-primary text-black" : "bg-gray-100 text-gray-500"
                }`}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {ROLE_ICONS[role]}
                </span>
              </div>
              <div>
                <p className={`font-semibold text-sm ${active ? "text-primary-dark" : "text-gray-900"}`}>
                  {ROLE_LABELS[role]}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  {ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}