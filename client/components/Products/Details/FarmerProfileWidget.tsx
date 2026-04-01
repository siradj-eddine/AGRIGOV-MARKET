import type { ApiFarm } from "@/types/Product";

interface Props {
  farm: ApiFarm;
  farmerName?: string;
}

export default function FarmerProfileWidget({ farm, farmerName }: Props) {
  const location   = [farm.wilaya, farm.baladiya].filter(Boolean).join(", "); 

  return (
    <div className="space-y-4">

      {/* Farmer card */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar placeholder (no avatar URL from backend yet) */}
          <div className="relative w-12 h-12 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary-dark text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              person
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-100 rounded-full border border-white flex items-center justify-center">
              <span
                className="material-symbols-outlined text-green-600"
                style={{ fontSize: "10px", fontVariationSettings: "'FILL' 1" }}
              >
                check
              </span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900">{farm.name}</h4>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {location || "Algeria"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Managed by {farmerName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Status", value:"Verified ✓" },
            { label: "Address", value: farm.address ?? "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-50 p-2.5 rounded-lg text-center"
            >
              <span className="block text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                {stat.label}
              </span>
              <span className="text-xs font-semibold text-gray-800 truncate block">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full py-2 text-sm font-medium text-primary-dark border border-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          Message Farmer
        </button>
      </div>

      {/* Verification notice */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 flex items-start gap-3">
        <span
          className="material-symbols-outlined text-primary-dark text-xl shrink-0 mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-900">Ministry Verified Farm</p>
          <p className="text-xs text-gray-500 mt-0.5">
            This farm has been reviewed and approved by a Ministry agent.
          </p>
        </div>
      </div>
    </div>
  );
}