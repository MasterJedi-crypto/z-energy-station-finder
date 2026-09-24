import { OTHER_SERVICES, PREFERENCE_SERVICES } from "./serviceOptions";

const LABELS = Object.fromEntries(
  [...PREFERENCE_SERVICES, ...OTHER_SERVICES].map((s) => [s.id, s.label]),
);

export function RecommendedStops({ stations, selectedIds, onToggle }) {
  if (!stations.length) {
    return (
      <p className="text-[14px] text-[#58595B]">
        No Z stations found along this route with the services you picked. Try{" "}
        <span className="font-bold">Edit trip</span> and remove a service or two.
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-[20px] font-bold text-[#353535]">
        Recommended Z stops ({stations.length})
      </h3>
      <p className="text-[13px] text-[#58595B]">
        Stops are based on your route, preferences and real-time information
      </p>
      <ul className="mt-4 flex flex-col gap-3">
        {stations.map((station) => {
          const added = selectedIds.includes(station.id);
          return (
            <li
              key={station.id}
              className="flex flex-col gap-3 rounded-[8px] border border-[#A7A9AC] p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="text-[16px] font-bold text-[#353535]">{station.name}</p>
                <p className="text-[12px] text-[#58595B]">{station.address}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(station.services ?? []).map((id) => (
                    <span
                      key={id}
                      className="rounded-[4px] bg-[#F6F8FF] px-2 py-1 text-[11px] font-bold text-z-navy"
                    >
                      {LABELS[id] ?? id}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[16px] font-bold text-[#353535]">
                    {station.price != null ? `$${station.price.toFixed(2)}` : "—"}
                  </p>
                  <p className="text-[11px] text-[#58595B]">per litre · {station.routeKm} km</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggle(station.id)}
                  aria-pressed={added}
                  className={`h-[32px] w-[96px] rounded-[4px] text-[13px] font-bold ${
                    added ? "bg-z-orange text-white" : "border border-z-navy text-z-navy"
                  }`}
                >
                  {added ? "Added" : "+Add stop"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}