import { useState } from "react";
import { LocationMap } from "./LocationMap";

export function FindStation({ onBack }) {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchPlaces(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/geocode?q=${encodeURIComponent(query.trim())}`
      );
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error("Unable to search for locations.");
      }

      setPlaces(data.places ?? []);
    } catch {
      setPlaces([]);
      setError("We couldn’t load locations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-white">
      <section className="bg-gradient-to-r from-[#f4510b] to-[#ffa534] px-6 py-12 text-white lg:px-20">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-3 text-lg font-semibold"
        >
          <span aria-hidden="true">←</span>
          Back
        </button>

        <h1 className="mb-8 text-4xl font-bold lg:text-5xl">
          Find a station
        </h1>

        <form
          onSubmit={searchPlaces}
          className="flex overflow-hidden rounded-md bg-white shadow-md"
        >
          <label htmlFor="station-search" className="sr-only">
            Enter an address or location
          </label>

          <input
            id="station-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Please enter an address"
            className="min-w-0 flex-1 px-5 py-5 text-lg text-[#252525] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 text-2xl text-[#171717] disabled:opacity-50"
            aria-label="Search for stations"
          >
            →
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-20">
        {loading ? (
          <p role="status" className="text-lg">
            Searching…
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="text-lg text-red-700">
            {error}
          </p>
        ) : null}

        {!loading && !error && places.length === 0 ? (
          <p className="text-lg text-gray-600">
            Search for a New Zealand location to get started.
          </p>
        ) : null}

               {!loading && !error && places.length > 0 ? (
          <>
            <h2 className="mb-5 text-2xl font-bold text-[#252525]">
              Search results
            </h2>

            <p className="mb-5 text-sm text-gray-600">
              These markers show matching locations, not individual Z stations.
            </p>

            <div className="grid items-start gap-6 lg:grid-cols-2">
              <ul className="grid min-w-0 gap-4">
                {places.map((place) => (
                  <li
                    key={`${place.label}-${place.lat}-${place.lng}`}
                    className="rounded-md border border-[#211878] bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-[#211878]">
                      {place.label}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Latitude: {place.lat} · Longitude: {place.lng}
                    </p>
                  </li>
                ))}
              </ul>

              <LocationMap places={places} />
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}