import express from "express";

export const app = express();
const port = Number(process.env.PORT) || 3001;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/geocode", (req, res) => {
  res.json([{ name: "Auckland", lat: -36.8485, lon: 174.7633 }]);
});

const startedDirectly = process.argv[1]
  ?.replaceAll("\\", "/")
  .endsWith("server/index.js");

if (startedDirectly) {
  app.listen(port, () => {
    console.log(`API listening on http://127.0.0.1:${port}`);
  });
}