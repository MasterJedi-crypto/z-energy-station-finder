import express from "express";
import { connectDb, getDb } from "./db.js";
import { createTripsRouter } from "./routes/trips.js";

export const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});
app.get("/geocode", (req, res) => {
  const query = req.query.q?.toLowerCase();

  const places = [
    { name: "Auckland", lat: -36.8485, lon: 174.7633 },
    { name: "Wellington", lat: -41.2865, lon: 174.7762 },
    { name: "Christchurch", lat: -43.5321, lon: 172.6362 },
  ];

  res.json(query ? places.filter(place =>
    place.name.toLowerCase().includes(query)
  ) : places);
});

app.use("/trips", createTripsRouter(() => getDb().collection("saved-trips")));

const startedDirectly = process.argv[1]
  ?.replaceAll("\\", "/")
  .endsWith("server/index.js");

if (startedDirectly) {
  await connectDb();
  app.listen(port, () => {
    console.log(`API listening on http://127.0.0.1:${port}`);
  });
}