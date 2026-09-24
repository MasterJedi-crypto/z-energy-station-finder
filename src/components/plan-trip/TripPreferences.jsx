import fuelPump from "../../assets/figma/fuel-pump.svg";
import { ServiceTile } from "./ServiceTile";
import { FUEL_TYPES, PREFERENCE_SERVICES } from "./serviceOptions";

const rowLabel = "w-[110px] shrink-0 text-[16px] font-bold text-[#353535] lg:text-[18px]";

export function TripPreferences({ fuelType, onFuelTypeChange, services, onToggleService }) {
  return (
    <div className="rounded-[10px] bg-[#F6F8FF] p-5">
      <p className="text-[18px] font-bold text-[#353535]">Your preferences</p>
      <p className="text-[12px] text-[#353535]">Based on your previous selection</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className={rowLabel}>Fuel type</span>
        <label className="relative flex-1 lg:max-w-[262px]">
          <img
            src={fuelPump}
            alt=""
            className="pointer-events-none absolute left-3 top-1/2 size-6 -translate-y-1/2"
          />
          <select
            value={fuelType}
            onChange={(e) => onFuelTypeChange(e.target.value)}
            aria-label="Fuel type"
            className="h-[45px] w-full appearance-none rounded-[4px] border border-[#58595B] bg-white pl-12 pr-2 text-[14px] text-[#353535]"
          >
            {FUEL_TYPES.map((fuel) => (
              <option key={fuel}>{fuel}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className={rowLabel}>Service type</span>
        <div className="flex flex-wrap gap-3">
          {PREFERENCE_SERVICES.map((service) => (
            <ServiceTile
              key={service.id}
              size="sm"
              label={service.label}
              icon={service.icon}
              selected={services.includes(service.id)}
              onToggle={() => onToggleService(service.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}