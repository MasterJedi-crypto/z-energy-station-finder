import express from "express";
import { connectDb, getDb } from "./db.js";
import { createAuthRouter, ensureAuthIndexes } from "./routes/auth.js";
import { createTripsRouter } from "./routes/trips.js";

export const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", createAuthRouter(getDb));
app.use("/trips", createTripsRouter(() => getDb().collection("saved-trips")));

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