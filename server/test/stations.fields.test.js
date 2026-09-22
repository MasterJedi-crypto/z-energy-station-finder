import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { createStationsRouter } from "../routes/stations.js";

const docs = [
  {
    id: "z-geraldine",
    name: "Z Geraldine",
    address: "State Highway 79, Geraldine",
    lat: -44.09,
    lng: 171.243,
    price: 2.35,
    services: ["coffee", "toilets"],
  },
];

// Fake collection that applies a projection like MongoDB does
const fakeCollection = {
  find: () => ({ toArray: async () => docs }),
  findOne: async (query, options = {}) => {
    const doc = docs.find((d) => d.id === query.id);
    if (!doc) return null;
    const keep = Object.keys(options.projection ?? {}).filter(
      (key) => options.projection[key] === 1,
    );
    if (!keep.length) return doc;
    return Object.fromEntries(keep.filter((k) => k in doc).map((k) => [k, doc[k]]));
  },
};

function makeApp() {
  const app = express();
  app.use("/stations", createStationsRouter(() => fakeCollection));
  return app;
}

describe("station price and services", () => {
  it("GET /stations includes price and services", async () => {
    const response = await request(makeApp()).get("/stations");
    expect(response.body.stations[0].price).toBe(2.35);
    expect(response.body.stations[0].services).toEqual(["coffee", "toilets"]);
  });

  it("GET /stations/:id includes price and services", async () => {
    const response = await request(makeApp()).get("/stations/z-geraldine");
    expect(response.body.station.price).toBe(2.35);
    expect(response.body.station.services).toEqual(["coffee", "toilets"]);
  });
});