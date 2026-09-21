import express from "express";
import { connectDb, getDb } from "./db.js";
import { createAuthRouter, ensureAuthIndexes } from "./routes/auth.js";
import { createTripsRouter } from "./routes/trips.js";
import { createStationsRouter } from "./routes/stations.js";
import { createRouteRouter } from "./routes/route.js";

export const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});
app.get("/geocode", (req, res) => {
  const query = String(req.query.q ?? "").trim().toLowerCase();

  const places = [
    { label: "Auckland", lat: -36.8485, lng: 174.7633 },
    { label: "Wellington", lat: -41.2865, lng: 174.7762 },
    { label: "Christchurch", lat: -43.5321, lng: 172.6362 },
  ];

  const results = query
    ? places.filter((place) => place.label.toLowerCase().includes(query))
    : places;

  res.json({ ok: true, places: results });
});

app.use("/auth", createAuthRouter(getDb));
app.use("/trips", createTripsRouter(() => getDb().collection("saved-trips")));
app.use("/stations", createStationsRouter(() => getDb().collection("stations")));
app.use("/route", createRouteRouter());

const startedDirectly = process.argv[1]
  ?.replaceAll("\\", "/")
  .endsWith("server/index.js");

if (startedDirectly) {
  await connectDb();
  await ensureAuthIndexes(getDb());
  app.listen(port, () => {
    console.log(`API listening on http://127.0.0.1:${port}`);
  });
}