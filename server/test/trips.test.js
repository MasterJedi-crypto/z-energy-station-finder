import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { createTripsRouter } from "../routes/trips.js";

function makeApp(collection) {
  const app = express();
  app.use(express.json());
  app.use("/trips", createTripsRouter(collection));
  return app;
}

describe("GET /trips", () => {
  it("returns 400 when userId is missing", async () => {
    const app = makeApp({});
    const response = await request(app).get("/trips");
    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
});

  it("returns only the trips for the given userId", async () => {
    const savedTrips = [
      { userId: "user1", from: "Christchurch", to: "Timaru" },
      { userId: "user2", from: "Auckland", to: "Hamilton" },
    ];
    const fakeCollection = {
      find: (query) => ({
        toArray: async () =>
          savedTrips.filter((trip) => trip.userId === query.userId),
      }),
    };

    const app = makeApp(fakeCollection);
    const response = await request(app).get("/trips?userId=user1");

    expect(response.status).toBe(200);
    expect(response.body.trips).toHaveLength(1);
    expect(response.body.trips[0].to).toBe("Timaru");
  });
    
  });
