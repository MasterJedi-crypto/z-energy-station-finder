import { Router } from "express";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}min` : `${mins}min`;
}

export function createRouteRouter({ fetchFn = fetch } = {}) {
  const router = Router();

async function resolvePoint(place, nearbyPoint = null) {
  const lat = Number(place?.lat);
  const lng = Number(place?.lng);

  if (
    place &&
    typeof place === "object" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  ) {
    return {
      label: place.label || "Selected location",
      lat,
      lng,
    };
  }

  if (typeof place !== "string" || !place.trim()) {
    return null;
  }

  const url = `${NOMINATIM_URL}?format=json&limit=5&countrycodes=nz&q=${encodeURIComponent(place)}`;

  const response = await fetchFn(url, {
    headers: {
      "User-Agent": "z-energy-mission5-student-project",
    },
  });

  if (!response.ok) return null;

  const results = await response.json();

  if (!results.length) return null;

  const possiblePoints = results
    .map((result) => ({
      label: result.display_name || place,
      lat: Number(result.lat),
      lng: Number(result.lon),
    }))
    .filter(
      (point) =>
        Number.isFinite(point.lat) &&
        Number.isFinite(point.lng)
    );

  if (!possiblePoints.length) return null;

  if (!nearbyPoint) {
    return possiblePoints[0];
  }
    possiblePoints.sort((first, second) => {
    const firstDistance =
      (first.lat - nearbyPoint.lat) ** 2 +
      (first.lng - nearbyPoint.lng) ** 2;

    const secondDistance =
      (second.lat - nearbyPoint.lat) ** 2 +
      (second.lng - nearbyPoint.lng) ** 2;

    return firstDistance - secondDistance;
  });

  return possiblePoints[0];
}
  router.post("/", async (req, res) => {
    const { from, to, stops = [] } = req.body ?? {};
    if (!from || !to) {
      return res.status(400).json({ ok: false, error: "from and to are required." });
    }

    const destination = await resolvePoint(to);

if (!destination) {
  return res.status(404).json({
    ok: false,
    error: `Couldn't find "${
      typeof to === "string" ? to : to?.label || "destination"
    }".`,
  });
}

const routePlaces = [from, ...stops];
const points = [];

for (const place of routePlaces) {
  const point = await resolvePoint(place, destination);

  if (!point) {
    const label =
      typeof place === "string"
        ? place
        : place?.label || "location";

    return res.status(404).json({
      ok: false,
      error: `Couldn't find "${label}".`,
    });
  }

  points.push(point);
}

  points.push(destination);

    const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
    const response = await fetchFn(`${OSRM_URL}/${coords}?overview=full&geometries=geojson`);
    const data = response.ok ? await response.json() : null;
    const route = data?.routes?.[0];
    if (!route) {
      return res.status(502).json({ ok: false, error: "Routing service is unavailable." });
    }

    const durationMin = Math.round(route.duration / 60);
    res.json({
      ok: true,
      origin: points[0],
      destination: points[points.length - 1],
      waypoints: points.slice(1, -1),
      distanceKm: Math.round(route.distance / 1000),
      durationMin,
      durationLabel: formatDuration(durationMin),
      path: route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
    });
  });

  return router;
}
