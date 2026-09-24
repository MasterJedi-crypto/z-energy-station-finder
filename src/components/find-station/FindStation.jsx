import { useMemo, useState } from "react";
import { LocationMap } from "./LocationMap";
import { TripPlannerButton } from "../plan-trip/TripPlannerButton";

export function FindStation({ onBack, onSelectStation, onPlanTrip }) {

  const [query, setQuery] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchLabel, setSearchLabel] = useState("");
  const [message, setMessage] = useState("");
  // Keep the existing map contract while giving it real station coordinates.
  const mapPlaces = useMemo(
    () => stations.map((station) => ({ ...station, label: station.name })),
    [stations],
  );
  async function searchStations(event) {
    event.preventDefault();
    if (loading) return;
    const search = query.trim();
    setLoading(true);
    setError("");
    setMessage("");
    setStations([]);
    setSearched(true);
    setSearchLabel("");
    try {
      let stationUrl = "/api/stations";
      if (search) {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(search)}`);
        const data = await response.json();
        if (!response.ok || !data?.ok || !Array.isArray(data.places)) {
          throw new Error("Location search failed");
        }
        if (data.places.length === 0) {
          setMessage("Location not found. Try Auckland, Wellington or Christchurch.");
          return;
        }
        const place = data.places[0];
        setSearchLabel(place.label);
        const params = new URLSearchParams({
          lat: String(place.lat),
          lng: String(place.lng),
          radiusKm: "25",
        });
        stationUrl = `/api/stations?${params}`;
      }
      const response = await fetch(stationUrl);
      const data = await response.json();
      if (!response.ok || !data?.ok || !Array.isArray(data.stations)) {
        throw new Error("Station search failed");
      }
      setStations(data.stations);
      if (data.stations.length === 0) {
        setMessage(search
          ? "No stations from our sample were found within 25 km of this location."
          : "No stations are available in our sample yet.");
      }
    } catch {
      setStations([]);
      setError("We couldn't load stations. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-[70vh] bg-white">
      <section className="bg-gradient-to-r from-[#f4510b] to-[#ffa534] px-6 py-12 text-white lg:px-20">
        <button type="button" onClick={onBack}
          className="mb-8 flex items-center gap-3 text-lg font-semibold">
          <span aria-hidden="true">←</span> Back
        </button>
        <h1 className="mb-8 text-4xl font-bold lg:text-5xl">Find a station</h1>
        <form onSubmit={searchStations}
          className="flex overflow-hidden rounded-md bg-white shadow-md">
          <label htmlFor="station-search" className="sr-only">Search by city</label>
          <input id="station-search" value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Enter Auckland, Wellington or Christchurch"
            className="min-w-0 flex-1 px-5 py-5 text-lg text-[#252525] focus:outline-2 focus:outline-[#211878] focus:outline-offset-[-4px]" />
          <button type="submit" disabled={loading}
            className="px-6 text-2xl text-[#171717] disabled:opacity-50"
            aria-label="Search for stations">→</button>
        </form>
       </section>

      <section className="border-b border-gray-200 bg-white">
  <div className="mx-auto grid max-w-[1440px] gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-20">
    <label className="block font-semibold text-[#252525]">
      Fuel type

      <select
        defaultValue=""
        className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-normal text-gray-700"
      >
        <option value="" disabled>
          Select fuel type
        </option>
        <option value="all">All fuel types</option>
        <option value="zx-premium">ZX Premium</option>
        <option value="z91">Z91 Unleaded</option>
        <option value="diesel">Z Diesel</option>
      </select>
    </label>

    <label className="block font-semibold text-[#252525]">
      Services

      <select
        defaultValue=""
        className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-normal text-gray-700"
      >
        <option value="" disabled>
          Service station
        </option>
        <option value="all">All services</option>
        <option value="toilets">Toilets</option>
        <option value="coffee">Coffee</option>
        <option value="24-7">24/7</option>
        <option value="truck-parking">Truck parking</option>
      </select>
    </label>

    <label className="block font-semibold text-[#252525]">
      Sort by

      <select
        defaultValue="distance"
        className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 font-normal text-gray-700"
      >
        <option value="distance">Distance</option>
        <option value="price-low">Price: low to high</option>
        <option value="price-high">Price: high to low</option>
      </select>
    </label>

    <div>
      <p className="font-semibold text-[#252525]">
        Trip Planner
      </p>

      <div className="mt-2">
        <TripPlannerButton onPlanTrip={onPlanTrip} />
      </div>
    </div>
  </div>
</section>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-20" aria-busy={loading}>
        <p className="mb-5 text-sm text-gray-600">
          Sample coverage: one Z station each in Auckland, Wellington and Christchurch.
        </p>
        {loading ? <p role="status" className="text-lg">Searching stations…</p> : null}
        {error ? <p role="alert" className="text-lg text-red-700">{error}</p> : null}
        {!loading && !error && !searched ? (
          <p className="text-lg text-gray-600">
            Search by city, or leave the search blank to view all sample stations.
          </p>
        ) : null}
        {!loading && !error && message ? (
          <p role="status" className="text-lg text-gray-600">{message}</p>
        ) : null}
        {!loading && !error && stations.length > 0 ? (
          <>
            <h2 className="mb-3 text-2xl font-bold text-[#252525]">
              {searchLabel ? `Z stations near ${searchLabel}` : "Z stations"}
            </h2>
            <p role="status" className="mb-5 text-sm text-gray-600">
              {stations.length} {stations.length === 1 ? "station" : "stations"} found.
              {searchLabel ? " Within 25 km of the city centre; distances are straight-line estimates." : ""}
            </p>
            <div className="grid items-start gap-6 lg:grid-cols-2">
              <ul className="grid min-w-0 gap-4">
                {stations.map((station) => (
                  <li key={station.id}
                    className="rounded-md border border-[#211878] bg-white p-5 shadow-sm">
                    <h3 className="text-xl font-bold text-[#211878]">{station.name}</h3>
                    <p className="mt-2 text-sm text-gray-600">{station.address}</p>

{Number.isFinite(station.distanceKm) ? (
  <p className="mt-3 font-semibold text-[#211878]">
    {station.distanceKm.toFixed(1)} km from {searchLabel} centre
  </p>
) : null}

<button
  type="button"
  onClick={() => onSelectStation(station.id)}
  className="mt-5 w-full rounded-lg bg-[#f4510b] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#d84308]"
>
  View station details
</button>
</li>
                ))}
              </ul>
              <LocationMap places={mapPlaces} />
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}