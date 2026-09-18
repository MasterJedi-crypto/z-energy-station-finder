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
});