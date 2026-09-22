import { Router } from "express";

function parseNumber(value, minimum, maximum) {
  if (typeof value !== "string" || value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= minimum && number <= maximum
    ? number
    : null;
}
function distanceKm(lat1, lng1, lat2, lng2) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const a =
    Math.sin(radians(lat2 - lat1) / 2) ** 2 +
    Math.cos(radians(lat1)) * Math.cos(radians(lat2)) *
      Math.sin(radians(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
}

export function createStationsRouter(getCollection) {
  const router = Router();

  router.get("/", async (req, res) => {
    const hasOrigin = req.query.lat !== undefined || req.query.lng !== undefined;
    const lat = parseNumber(req.query.lat, -90, 90);
    const lng = parseNumber(req.query.lng, -180, 180);
    const radiusKm = req.query.radiusKm === undefined
      ? 25
      : parseNumber(req.query.radiusKm, 0.1, 200);

    if (
      (hasOrigin && (lat === null || lng === null)) ||
      radiusKm === null ||
      (!hasOrigin && req.query.radiusKm !== undefined)
    ) {
      return res.status(400).json({
        ok: false,
        error: "Supply valid lat and lng together; radiusKm must be between 0.1 and 200.",
      });
    }

    try {
      // Appropriate for the small seeded dataset. A larger dataset can use a
      // MongoDB geospatial index instead of calculating distances in memory.
      const documents = await getCollection().find({}).toArray();
      let stations = documents
        .filter((station) =>
          Number.isFinite(station.lat) && Math.abs(station.lat) <= 90 &&
          Number.isFinite(station.lng) && Math.abs(station.lng) <= 180,
        )
        .map((station) => ({
          id: station.id,
          name: station.name,
          address: station.address,
          lat: station.lat,
          lng: station.lng,
          price: station.price ?? null,   //changes added for my page (koni)
          services: station.services ?? [],
          ...(hasOrigin ? {
            distanceKm: distanceKm(lat, lng, station.lat, station.lng),
          } : {}),
        }));

      if (hasOrigin) {
        stations = stations
          .filter((station) => station.distanceKm <= radiusKm)
          .sort((a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name))
          .map((station) => ({
            ...station,
            distanceKm: Math.round(station.distanceKm * 100) / 100,
          }));
      } else {
        stations.sort((a, b) => a.name.localeCompare(b.name));
      }
      return res.json({ ok: true, stations });
    } catch {
      return res.status(503).json({
        ok: false,
        error: "Stations are temporarily unavailable. Please try again.",
      });
    }
  });
  router.get("/:id", async (req, res) => {
    try {
      const station = await getCollection().findOne(
        { id: req.params.id },
        {
          projection: {
            _id: 0,
            id: 1,
            name: 1,
            address: 1,
            lat: 1,
            lng: 1,
            price: 1, // changes added (koni) for my page
            services: 1,
          },
        }
      );

      if (!station) {
        return res.status(404).json({
          ok: false,
          error: "Station not found.",
        });
      }

      return res.json({
        ok: true,
        station,
      });
    } catch {
      return res.status(503).json({
        ok: false,
        error: "Station details are temporarily unavailable.",
      });
    }
  });
  return router;
}
