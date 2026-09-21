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

  async function geocode(place) {
    const url = `${NOMINATIM_URL}?format=json&limit=1&countrycodes=nz&q=${encodeURIComponent(place)}`;
    const response = await fetchFn(url, {
      headers: { "User-Agent": "z-energy-mission5-student-project" },
    });
    if (!response.ok) return null;
    const results = await response.json();
    if (!results.length) return null;
    return { label: place, lat: Number(results[0].lat), lng: Number(results[0].lon) };
  }

  router.post("/", async (req, res) => {
    const { from, to, stops = [] } = req.body ?? {};
    if (!from || !to) {
      return res.status(400).json({ ok: false, error: "from and to are required." });
    }

    const points = [];
    for (const name of [from, ...stops, to]) {
      const point = await geocode(name);
      if (!point) {
        return res.status(404).json({ ok: false, error: `Couldn't find "${name}".` });
      }
      points.push(point);
    }

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
