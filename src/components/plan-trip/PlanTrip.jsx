import { useEffect, useState } from "react";
import { deleteTrip, listTrips, planRoute, saveTrip } from "../../api";
import { SavedTrips } from "./SavedTrips";
import { TripHero } from "./TripHero";
import { TripFields } from "./TripFields";
import { TripPreferences } from "./TripPreferences";
import { OtherServices } from "./OtherServices";
import { CheapestToggle } from "./CheapestToggle";
import { FUEL_TYPES } from "./serviceOptions";
import { TripResults } from "./TripResults";
import { TripSummaryBar } from "./TripSummaryBar";

export function PlanTrip({ account, onNeedLogin }) {
  const userId = account?.userId;
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [stop, setStop] = useState("");
  const [fuelType, setFuelType] = useState(FUEL_TYPES[0]);
  const [services, setServices] = useState([]);
  const [cheapest, setCheapest] = useState(false);
  const [planned, setPlanned] = useState(false);
  const [saved, setSaved] = useState(false);
  const [route, setRoute] = useState(null);
  const [planning, setPlanning] = useState(false);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  async function loadTrips() {
    if (!userId) {
      setTrips([]);
      return;
    }
    try {
      setTrips(await listTrips(userId));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTrips();
  }, [userId]);

  function toggleService(id) {
    setServices((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );
  }

  async function handlePlan(event) {
    event.preventDefault();
    if (!from.trim() || !to.trim()) {
      setError("Please enter a starting point and a destination.");
      return;
    }
    setError("");
    setPlanning(true);
    try {
      const result = await planRoute({ from, to, stops: stop ? [stop] : [] });
      setRoute(result);
      setSaved(false);
      setPlanned(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlanning(false);
    }
  }

  async function handleSave() {
    setError("");
    if (!userId) {
      setError("Log in to save this trip.");
      onNeedLogin?.();
      return;
    }
    try {
      await saveTrip({
        userId,
        from,
        to,
        stops: stop ? [stop] : [],
        origin: route?.origin,
        destination: route?.destination,
        distanceKm: route?.distanceKm,
        durationLabel: route?.durationLabel,
      });
      setSaved(true);
      await loadTrips();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteTrip(id, userId);
      await loadTrips();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <TripHero />
      <div className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-16">
        {planned ? (
          <>
            <TripSummaryBar
              trip={{ from, to, stop, fuelType, services }}
              onEdit={() => setPlanned(false)}
            />
            <TripResults
              trip={{ from, to, stop, fuelType, services, cheapest }}
              route={route}
              saved={saved}
              onSave={handleSave}
              onEdit={() => setPlanned(false)}
            />
          </>
        ) : (
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

            <button
              type="submit"
              disabled={planning}
              className="mx-auto h-[42px] w-full max-w-[237px] rounded-[8px] bg-z-navy text-[16px] font-bold text-white disabled:opacity-60"
            >
              {planning ? "Planning…" : "Plan my Trip"}
            </button>
          </form>
        )}

        {error ? (
          <p role="alert" className="mx-auto mt-4 max-w-[895px] text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mx-auto max-w-[895px]">
          <SavedTrips trips={trips} onDelete={handleDelete} />
        </div>
      </div>
    </>
  );
}