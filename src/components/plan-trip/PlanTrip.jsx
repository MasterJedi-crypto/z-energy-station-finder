import { useEffect, useState } from "react";
import { deleteTrip, listTrips, saveTrip } from "../../api";
import { SavedTrips } from "./SavedTrips";

// TODO: replace with the logged-in user once Rodrigo's auth is ready
const DEMO_USER_ID = "user1";

export function PlanTrip() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
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

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    try {
      await saveTrip({ userId: DEMO_USER_ID, from, to });
      setFrom("");
      setTo("");
      await loadTrips();
    } catch (err) {
      setError(err.message);
    }
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
    <section className="mx-auto max-w-[1440px] px-5 py-10 lg:px-16">
      <h1 className="text-3xl font-extrabold text-z-navy">Plan a trip</h1>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-3 lg:flex-row">
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Starting point"
          className="rounded-lg border border-gray-300 px-4 py-3"
        />
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Destination"
          className="rounded-lg border border-gray-300 px-4 py-3"
        />
        <button
          type="submit"
          className="rounded-full bg-z-orange px-6 py-3 font-bold text-white"
        >
          Save trip
        </button>
      </form>

      {error ? <p role="alert" className="mt-3 text-red-600">{error}</p> : null}

      <SavedTrips trips={trips} onDelete={handleDelete} />
    </section>
  );
}