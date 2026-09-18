import express from "express";
import { db } from "./db.js";
import { createTripsRouter } from "./routes/trips.js";

export const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/trips", createTripsRouter(db.collection("saved-trips")));

const startedDirectly = process.argv[1]
  ?.replaceAll("\\", "/")
  .endsWith("server/index.js");

if (startedDirectly) {
  app.listen(port, () => {
    console.log(`API listening on http://127.0.0.1:${port}`);
  });
}