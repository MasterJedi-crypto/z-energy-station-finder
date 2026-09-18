import { Router } from "express";
import { ObjectId } from "mongodb";

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

  router.post("/", async (req, res) => {
    const { userId, from, to } = req.body ?? {};
    if (!userId || !from || !to) {
        return res.status(400).json({ ok: false, error: "userId, from and to are required." });
    }

    const trip = { userId, from, to, 
        stops: req.body.stops ?? [],
        origin: req.body.origin ?? null,
        destination: req.body.destination ?? null,
        selectedStationsIds: req.body.selectedStationsIds ?? [],
        distanceKm: req.body.distanceKm ?? null,
        durationLabel: req.body.durationLabel ?? null,
        createdAt: new Date(),  
    };

    const result = await collection.insertOne(trip);
    res.status(201).json({ ok: true, id: result.insertedId });
});

    router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ ok: false, error: "userId is required." });
        }
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ ok: false, error: "Invalid trip ID." });
        }
        const result = await collection.deleteOne({ _id: new ObjectId(id), userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ ok: false, error: "Trip not found." });
        }
        res.json({ ok: true });
        
        });

  return router;
}