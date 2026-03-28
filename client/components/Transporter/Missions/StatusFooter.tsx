interface StatusFooterProps {
  gpsActive:    boolean;
  fleetLabel:   string;
  connection:   string;
}

export default function StatusFooter({
  gpsActive,
  fleetLabel,
  connection,
}: StatusFooterProps) {
  return (
    <footer className="h-10 bg-primary px-4 flex items-center justify-between text-background-dark text-[11px] font-bold uppercase tracking-widest shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span
            className={`size-2 rounded-full bg-white ${gpsActive ? 'animate-pulse' : 'opacity-40'}`}
          />
          GPS: {gpsActive ? 'Active' : 'Inactive'}
        </div>
        <div className="opacity-60">Fleet: {fleetLabel}</div>
      </div>
      <div>Connection: {connection}</div>
    </footer>
  );
}