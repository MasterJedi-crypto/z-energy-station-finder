import tripFieldPin from "../../assets/figma/trip-field-pin.svg";
import tripAdd from "../../assets/figma/trip-add.svg";
import fuelPump from "../../assets/figma/fuel-pump.svg";
import { ServiceTile } from "./ServiceTile";
import { PREFERENCE_SERVICES } from "./serviceOptions";

function SummaryBox({ icon, children }) {
  return (
    <div className="relative flex h-[40px] items-center rounded-[4px] border border-[#58595B] bg-white px-3 text-[14px] text-[#58595B]">
      {icon ? <img src={icon} alt="" className="size-5 shrink-0" /> : null}
      <span className="mx-auto truncate">{children}</span>
    </div>
  );
}

const label = "text-[14px] font-bold text-[#353535]";

export function TripSummaryBar({ trip, onEdit }) {
  return (
    <section className="relative mx-auto flex max-w-[895px] flex-col gap-6 rounded-[10px] bg-[#F6F8FF] p-5 lg:-mt-[140px] lg:flex-row lg:gap-8">
      <div className="grid flex-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className={label}>From</span>
          <SummaryBox>{trip.from}</SummaryBox>
        </div>
        <div className="flex flex-col gap-1">
          <span className={label}>
            Add a stop <span className="font-normal">(optional)</span>
          </span>
          <SummaryBox icon={tripFieldPin}>{trip.stop || "—"}</SummaryBox>
        </div>
        <div className="flex flex-col gap-1">
          <span className={label}>To</span>
          <SummaryBox icon={tripFieldPin}>{trip.to}</SummaryBox>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2 self-end text-[14px] text-z-navy"
        >
          <img src={tripAdd} alt="" className="size-5" />
          Add another stop
        </button>
      </div>

      <span className="hidden w-px self-stretch bg-[#A7A9AC] lg:block" aria-hidden="true" />

      <div className="flex flex-col gap-3 lg:w-[344px]">
        <div>
          <h2 className="text-[20px] font-bold text-[#353535]">Your preferences</h2>
          <p className="text-[15px] text-[#353535]">Based on your previous selection</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-[40px] items-center gap-2 rounded-[4px] border border-[#58595B] bg-white px-3 text-[14px] text-[#353535]">
            <img src={fuelPump} alt="" className="size-5" />
            {trip.fuelType}
            <button type="button" onClick={onEdit} className="ml-2 text-[12px] font-bold text-z-navy">
              Edit
            </button>
          </div>
          {PREFERENCE_SERVICES.filter((s) => trip.services.includes(s.id)).map((service) => (
            <ServiceTile
              key={service.id}
              size="sm"
              label={service.label}
              icon={service.icon}
              selected
              onToggle={onEdit}
            />
          ))}
        </div>
      </div>
    </section>
  );
}