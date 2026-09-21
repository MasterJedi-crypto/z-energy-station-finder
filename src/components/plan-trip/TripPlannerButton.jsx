export function TripPlannerButton({ onPlanTrip }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[20px] font-bold text-black">Trip planner</p>
      <button
        type="button"
        onClick={onPlanTrip}
        className="flex h-[50px] w-full max-w-[294px] items-center justify-center gap-[10px] rounded-[5px] border-[0.5px] border-[#6E6E6E] bg-white p-[10px]"
      >
        <span className="text-[15px] font-bold text-[#6E6E6E]">Plan my trip</span>
      </button>
    </div>
  );
}