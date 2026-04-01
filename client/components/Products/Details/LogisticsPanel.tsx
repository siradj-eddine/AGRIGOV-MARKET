import Image from "next/image";
import type { LogisticsDetail } from "@/types/ProductDetails";

interface Props {
  mapImageUrl:    string | null;
  warehouseLabel: string;
  logistics:      LogisticsDetail[];
}

export default function OriginLogisticsPanel({ mapImageUrl, warehouseLabel, logistics }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">Origin &amp; Logistics</h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Map or placeholder */}
        <div className="w-full md:w-2/3 h-56 rounded-xl overflow-hidden relative bg-neutral-100">
          {mapImageUrl ? (
            <>
              <Image
                src={mapImageUrl}
                alt="Map showing origin warehouse location"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white p-2 rounded-lg shadow-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    location_on
                  </span>
                  <span className="text-sm font-bold text-gray-800">{warehouseLabel}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 gap-2">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                map
              </span>
              <p className="text-sm font-medium">{warehouseLabel}</p>
              <p className="text-xs">Interactive map coming soon</p>
            </div>
          )}
        </div>

        {/* Logistics list */}
        <div className="w-full md:w-1/3 space-y-4">
          {logistics.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className={`${item.iconBg} p-2 rounded-full shrink-0`}>
                <span
                  className={`material-symbols-outlined text-xl ${item.iconColor}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-900">{item.title}</h5>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}