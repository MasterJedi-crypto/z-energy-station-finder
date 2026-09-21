import tripSaveHeart from "../../assets/figma/trip-save-heart.svg";
import { OTHER_SERVICES, PREFERENCE_SERVICES } from "./serviceOptions";

const ALL_SERVICES = [...PREFERENCE_SERVICES, ...OTHER_SERVICES];

export function TripResults({ trip, saved, onSave, onEdit }) {
  const serviceLabels = ALL_SERVICES.filter((s) =>
    trip.services.includes(s.id),
  ).map((s) => s.label);

  return (
    <section className="relative mx-auto flex max-w-[895px] flex-col gap-6 rounded-[10px] border border-[#A7A9AC] bg-white p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] mt-6 lg:p-[25px]">
      <div>
        <h2 className="text-[24px] font-bold text-[#353535]">Your trip</h2>
        <p className="text-[18px] font-bold text-[#353535]">
          {trip.from} → {trip.to}
        </p>
        {trip.stop ? (
          <p className="text-[16px] text-[#58595B]">Stopping at {trip.stop}</p>
        ) : null}
      </div>

      {/* Map, route and recommended Z stops go here (stretch goal) */}

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={saved}
          className="flex h-[45px] w-full max-w-[237px] items-center justify-center gap-2 rounded-[8px] border border-z-orange bg-white font-bold text-z-orange disabled:opacity-60"
        >
          <img src={tripSaveHeart} alt="" className="size-5" />
          {saved ? "Trip saved" : "Save trip"}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="text-[14px] font-bold text-z-navy underline"
        >
          Edit trip
        </button>
      </div>
    </section>
  );
}
