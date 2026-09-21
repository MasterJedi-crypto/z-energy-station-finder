export function CheapestToggle({ checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-[8px] border border-[#E5E5E5] p-4">
      <span>
        <span className="block text-[18px] font-bold text-[#353535]">
          Find me the cheapest stop
        </span>
        <span className="block text-[13px] text-[#58595B]">
          We will suggest the best fuel prices along your route with the services you selected.
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="relative mt-1 h-5 w-9 shrink-0 rounded-full bg-[#BCBCBC] transition after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:bg-z-orange peer-checked:after:translate-x-4" />
    </label>
  );
}