const EARTH_RADIUS_KM = 6371;

export function haversineKm(a, b) {
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function stationsAlongRoute(path, stations, maxOffKm = 5) {
  if (path.length < 2) return [];

  // How far along the route each path point is
  const kmAlong = [0];
  for (let i = 1; i < path.length; i += 1) {
    kmAlong.push(kmAlong[i - 1] + haversineKm(path[i - 1], path[i]));
  }

  return stations
    .map((station) => {
      let offKm = Infinity;
      let routeKm = 0;
      path.forEach((point, i) => {
        const distance = haversineKm(point, station);
        if (distance < offKm) {
          offKm = distance;
          routeKm = kmAlong[i];
        }
      });
      return { ...station, offKm, routeKm: Math.round(routeKm) };
    })
    .filter((station) => station.offKm <= maxOffKm)
    .sort((a, b) => a.routeKm - b.routeKm);
}