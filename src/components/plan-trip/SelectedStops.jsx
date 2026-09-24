import tripCancel from "../../assets/figma/trip-cancel.svg";

export function SelectedStops({ stations, onRemove }) {
  if (!stations.length) return null;

  return (
    <div>
      <h3 className="text-[20px] font-bold text-[#353535]">
        You selected stops ({stations.length})
      </h3>
      <p className="text-[13px] text-[#58595B]">You can remove a stop</p>
      <ul className="mt-4 flex flex-col gap-3">
        {stations.map((station) => (
          <li
            key={station.id}
            className="flex items-center justify-between gap-4 rounded-[8px] border border-[#A7A9AC] p-4"
          >
            <div>
              <p className="text-[16px] font-bold text-[#353535]">{station.name}</p>
              <p className="text-[12px] text-[#58595B]">{station.address}</p>
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
                onClick={() => onRemove(station.id)}
                aria-label={`Remove ${station.name}`}
              >
                <img src={tripCancel} alt="" className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}