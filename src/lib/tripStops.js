export function recommendStops(stations, services = [], cheapest = false) {
  const matching = stations.filter((station) =>
    services.every((id) => (station.services ?? []).includes(id)),
  );
  return cheapest ? [...matching].sort((a, b) => a.price - b.price) : matching;
}