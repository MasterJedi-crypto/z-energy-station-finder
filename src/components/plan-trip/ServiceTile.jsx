export function ServiceTile({ label, icon, selected, onToggle, size = "lg" }) {
  const sizing =
    size === "sm" ? "h-[52px] w-[58px] text-[11px]" : "h-[75px] w-full text-[14px]";
  const state = selected
    ? "border-2 border-z-orange bg-[#FFF3EC]"
    : "border border-z-navy bg-white";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`flex flex-col items-center justify-center gap-1 rounded-[8px] font-bold text-z-navy shadow-[0_2px_4px_rgba(30,25,106,0.25)] ${sizing} ${state}`}
    >
      <img src={icon} alt="" className={size === "sm" ? "size-5" : "size-7"} />
      {label}
    </button>
  );
}