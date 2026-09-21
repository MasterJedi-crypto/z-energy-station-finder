import { useEffect, useState } from "react";
import { deleteTrip, listTrips } from "../../api";
import { SavedTrips } from "./SavedTrips";
import { TripHero } from "./TripHero";
import { TripFields } from "./TripFields";
import { TripPreferences } from "./TripPreferences";
import { OtherServices } from "./OtherServices";
import { CheapestToggle } from "./CheapestToggle";
import { FUEL_TYPES } from "./serviceOptions";

// TODO: replace with the logged-in user from auth.js
const DEMO_USER_ID = "user1";

export function PlanTrip() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stop, setStop] = useState("");
  const [fuelType, setFuelType] = useState(FUEL_TYPES[0]);
  const [services, setServices] = useState([]);
  const [cheapest, setCheapest] = useState(false);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  async function loadTrips() {
    try {
      setTrips(await listTrips(DEMO_USER_ID));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTrips();
  }, []);

  function toggleService(id) {
    setServices((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );
  }

  function handlePlan(event) {
    event.preventDefault();
    if (!from.trim() || !to.trim()) {
      setError("Please enter a starting point and a destination.");
      return;
    }
    setError("");
    // TODO: show Stage 2 (Your trip) here
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteTrip(id, DEMO_USER_ID);
      await loadTrips();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <TripHero />
      <div className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-16">
        <form
          onSubmit={handlePlan}
          className="relative mx-auto flex max-w-[895px] flex-col gap-6 rounded-[10px] border border-[#A7A9AC] p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] lg:-mt-[140px] lg:p-[25px]"
        >
          <TripFields
            from={from}
            to={to}
            stop={stop}
            onFromChange={setFrom}
            onToChange={setTo}
            onStopChange={setStop}
          />
          <TripPreferences
            fuelType={fuelType}
            onFuelTypeChange={setFuelType}
            services={services}
            onToggleService={toggleService}
          />
          <OtherServices services={services} onToggleService={toggleService} />
          <CheapestToggle checked={cheapest} onChange={setCheapest} />

          {error ? <p role="alert" className="text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="mx-auto h-[42px] w-full max-w-[237px] rounded-[8px] bg-z-navy text-[16px] font-bold text-white"
          >
            Plan my Trip
          </button>
        </form>

        <div className="mx-auto max-w-[780px]">
          <SavedTrips trips={trips} onDelete={handleDelete} />
        </div>
      </div>
    </>
  );
}