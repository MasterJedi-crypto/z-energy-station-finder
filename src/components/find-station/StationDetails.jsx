
import { useEffect, useState } from "react";

export function StationDetails({ stationId, onBack }) {
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStation() {
      setLoading(true);
      setError("");
      setStation(null);

      try {
        const response = await fetch(
          `/api/stations/${encodeURIComponent(stationId)}`
        );

        const data = await response.json();

        if (!response.ok || !data.ok || !data.station) {
          throw new Error("Station not found");
        }

        if (active) {
          setStation(data.station);
        }
      } catch {
        if (active) {
          setError("Unable to load station details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (stationId) {
      loadStation();
    } else {
      setLoading(false);
      setError("No station selected.");
    }

    return () => {
      active = false;
    };
  }, [stationId]);

  return (
    <main className="min-h-[70vh] bg-white">
      <section className="bg-gradient-to-r from-[#f4510b] to-[#ffa534] px-6 py-10 text-white lg:px-20">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 font-semibold"
        >
          ← Back to Find a Station
        </button>

        <h1 className="text-4xl font-bold">
          Station Details
        </h1>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        {loading && (
          <p role="status">
            Loading station details...
          </p>
        )}

        {error && (
          <div role="alert">
            <p className="mb-4 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={onBack}
              className="rounded-lg bg-orange-600 px-5 py-3 text-white"
            >
              Back to search
            </button>
          </div>
        )}

        {!loading && !error && station && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-md">
            <div className="bg-orange-50 p-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {station.name}
              </h2>

              <p className="mt-2 text-gray-700">
                {station.address}
              </p>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  Station location
                </h3>

                <p className="text-gray-700">
                  {station.address}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold">
                  Coordinates
                </h3>

                <p className="text-gray-700">
                  Latitude: {station.lat}
                </p>

                <p className="text-gray-700">
                  Longitude: {station.lng}
                </p>
              </div>

              <button
                type="button"
                onClick={onBack}
                className="rounded-lg bg-[#f4510b] px-6 py-3 font-semibold text-white hover:bg-orange-700"
              >
                Find another station
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}