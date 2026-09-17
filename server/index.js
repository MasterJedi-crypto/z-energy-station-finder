import express from "express";

export const app = express();
const port = Number(process.env.PORT) || 3001;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const startedDirectly = process.argv[1]
  ?.replaceAll("\\", "/")
  .endsWith("server/index.js");

if (startedDirectly) {
  app.listen(port, () => {
    console.log(`API listening on http://127.0.0.1:${port}`);
  });
}