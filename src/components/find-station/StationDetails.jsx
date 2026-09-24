
import { useEffect, useState } from "react";
import { planRoute } from "../../api";
import { LocationMap } from "./LocationMap";

export function StationDetails({ stationId, onBack }) {
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startingLocation, setStartingLocation] = useState("");
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

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

  async function handleDirections(event) {
    event.preventDefault();

    const from = startingLocation.trim();

    if (!from) {
      setRouteError("Enter your starting location.");
      return;
    }
    setRouteLoading(true);
    setRouteError("");
    setRoute(null);

    try {
      const result = await planRoute({
  from,
  to: {
    label: station.address,
    lat: station.lat,
    lng: station.lng,
  },
});

      setRoute(result);
    } catch (routeRequestError) {
      setRouteError(
        routeRequestError.message || "Unable to calculate directions."
      );
    } finally {
      setRouteLoading(false);
    }
  }

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

              {Number.isFinite(station.price) && (
                <div className="rounded-xl bg-orange-50 p-5">
                  <h3 className="text-xl font-bold text-gray-900">
                    Fuel price
                  </h3>

                  <p className="mt-2 text-2xl font-bold text-[#f4510b]">
                    ${station.price.toFixed(2)}
                    <span className="ml-1 text-sm font-normal text-gray-600">
                      per litre
                    </span>
                  </p>
                </div>
              )}
              {Array.isArray(station.services) &&
                station.services.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-xl font-bold">
                      Services available
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {station.services.map((service) => (
                        <span
                          key={service}
                          className="rounded-full border border-[#28146f] bg-white px-4 py-2 text-sm font-semibold capitalize text-[#28146f]"
                        >
                          {service.replaceAll("-", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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
              <div>
                <h3 className="mb-3 text-xl font-bold">
                  Get directions
                </h3>

                <form
                  onSubmit={handleDirections}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <label htmlFor="starting-location" className="sr-only">
                    Starting location
                  </label>

                  <input
                    id="starting-location"
                    type="text"
                    value={startingLocation}
                    onChange={(event) =>
                      setStartingLocation(event.target.value)
                    }
                    placeholder="Street, suburb, city or postcode"
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                  />

                  <button
                    type="submit"
                    disabled={routeLoading}
                    className="rounded-lg bg-[#f4510b] px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {routeLoading ? "Finding route..." : "Get Directions"}
                  </button>
                </form>

                {routeError && (
                  <p role="alert" className="mt-3 text-red-600">
                    {routeError}
                  </p>
                )}
              </div>

              {route && (
                <div className="rounded-lg bg-orange-50 p-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Route summary
                  </h3>

                  <p className="mt-2 text-gray-700">
                    Approximately {route.distanceKm} km ·{" "}
                    {route.durationLabel} driving time
                  </p>
                </div>
              )}

              <LocationMap
                places={
                  route
                    ? [
                        route.origin,
                        {
                          label: station.name,
                          lat: station.lat,
                          lng: station.lng,
                        },
                      ]
                    : [
                        {
                          label: station.name,
                          lat: station.lat,
                          lng: station.lng,
                        },
                      ]
                }
                routePath={route?.path ?? []}
              />
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