export function recommendStops(stations, services = [], cheapest = false) {
  const matching = stations.filter((station) =>
    services.every((id) => (station.services ?? []).includes(id)),
  );
  return cheapest ? [...matching].sort((a, b) => a.price - b.price) : matching;
}

export function googleMapsUrl(origin, destination, stops = []) {
  const point = (p) => `${p.lat},${p.lng}`;
  const params = new URLSearchParams({
    api: "1",
    origin: point(origin),
    destination: point(destination),
    travelmode: "driving",
  });
  if (stops.length) params.set("waypoints", stops.map(point).join("|"));
  return `https://www.google.com/maps/dir/?${params}`;
}