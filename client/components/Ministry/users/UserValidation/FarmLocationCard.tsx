import Image from 'next/image';

interface FarmLocationCardProps {
  mapImageUrl:  string;
  farmName:     string;
  farmCoords:   string;
  farmHectares: number;
  onFullMap:    () => void;
}

export default function FarmLocationCard({
  mapImageUrl,
  farmName,
  farmCoords,
  farmHectares,
  onFullMap,
}: FarmLocationCardProps) {
  return (
    <div className="bg-background-light dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-primary/10 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">map</span>
          Farm Location
        </h3>
        <button
          onClick={onFullMap}
          className="text-primary text-xs font-bold uppercase hover:underline"
        >
          Full Map
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden aspect-square relative border border-primary/10">
        <Image
          src={mapImageUrl}
          alt="Satellite top-down view of a rectangular green agricultural plot"
          fill
          sizes="(min-width: 1024px) 25vw, 100vw"
          className="object-cover"
        />

        {/* Map overlay info pill */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
          </div>
          <div>
            <p className="text-xs font-bold leading-tight text-slate-900 dark:text-slate-100">
              {farmName}
            </p>
            <p className="text-[10px] text-slate-500">
              {farmCoords} • {farmHectares} Hectares
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}