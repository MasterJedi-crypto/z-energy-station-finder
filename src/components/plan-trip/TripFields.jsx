import tripFieldPin from "../../assets/figma/trip-field-pin.svg";

const labelClass = "text-[16px] font-bold text-[#353535] lg:text-[20px]";
const inputClass =
  "h-[50px] w-full rounded-[4px] border border-[#58595B] bg-white text-[16px] text-[#58595B] outline-none placeholder:text-[#58595B] lg:text-[20px]";

function PlaceField({ label, value, onChange, placeholder }) {
  return (
    <label className="flex flex-col gap-2">
      <span className={labelClass}>{label}</span>
      <span className="relative">
        <img
          src={tripFieldPin}
          alt=""
          className="pointer-events-none absolute left-[10px] top-1/2 size-6 -translate-y-1/2"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} pl-[44px] pr-4 text-center`}
        />
      </span>
    </label>
  );
}

export function TripFields({ from, to, stop, onFromChange, onToChange, onStopChange }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-[34px]">
        <PlaceField label="From" value={from} onChange={onFromChange} placeholder="Current location" />
        <PlaceField label="To" value={to} onChange={onToChange} placeholder="Destination" />
      </div>
      <label className="flex flex-col gap-2">
        <span className={labelClass}>
          Add a stop: <span className="font-semibold">(optional)</span>
        </span>
        <input
          value={stop}
          onChange={(e) => onStopChange(e.target.value)}
          placeholder="Add a town or address if you are planning to stop along the way"
          className={`${inputClass} px-[21px]`}
        />
      </label>
    </div>
  );
}