import { Router } from "express";

export function createTripsRouter(collection) {
  const router = Router();

  router.get("/", async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ ok: false, error: "userId is required." });
    }
    const trips = await collection.find({ userId }).toArray();
    res.json({ ok: true, trips });
  });

  return router;
}