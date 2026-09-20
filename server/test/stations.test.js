import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../index.js";
import { setApiDb } from "../db.js";
import { stationSeeds } from "../data/stations.js";

describe("GET /stations", () => {
  let toArray;
  let collection;

  beforeEach(() => {
    toArray = vi.fn().mockResolvedValue(stationSeeds);
    collection = vi.fn(() => ({ find: () => ({ toArray }) }));
    setApiDb({ collection });
  });

  afterEach(() => setApiDb(undefined));

  it("returns station records through index.js using the stations collection", async () => {
    const response = await request(app).get("/stations");
    expect(response.status).toBe(200);
    expect(collection).toHaveBeenCalledWith("stations");
    expect(response.body.stations).toHaveLength(3);
    expect(response.body.stations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: "z-vivian-st", name: "Z Vivian St",
        address: "174 Vivian St, Wellington", lat: expect.any(Number), lng: expect.any(Number),
      }),
    ]));
    expect(response.body.stations[0]).not.toHaveProperty("distanceKm");
  });

  it("returns nearby Wellington stations and excludes Auckland and Christchurch", async () => {
    const response = await request(app).get("/stations?lat=-41.2865&lng=174.7762");
    expect(response.status).toBe(200);
    expect(response.body.stations.map((station) => station.id)).toEqual(["z-vivian-st"]);
    expect(response.body.stations[0].distanceKm).toBeGreaterThan(0.8);
    expect(response.body.stations[0].distanceKm).toBeLessThan(1);
  });

  it("sorts by distance and applies the radius before rounding", async () => {
    toArray.mockResolvedValue([
      { id: "far", name: "Far", address: "Test", lat: 0, lng: 0.02 },
      { id: "outside", name: "Outside", address: "Test", lat: 0, lng: 0.09 },
      { id: "near", name: "Near", address: "Test", lat: 0, lng: 0.01 },
    ]);
    const response = await request(app).get("/stations?lat=0&lng=0&radiusKm=10");
    expect(response.status).toBe(200);
    expect(response.body.stations.map((station) => station.id)).toEqual(["near", "far"]);
    expect(response.body.stations[0].distanceKm).toBeCloseTo(1.11, 2);
  });

  it.each([
    "lat=-41", "lng=174", "lat=&lng=174", "lat=oops&lng=174",
    "lat=91&lng=174", "lat=-41&lng=181", "lat=1&lat=2&lng=3",
    "lat=-41&lng=174&radiusKm=0", "lat=-41&lng=174&radiusKm=201",
    "radiusKm=25",
  ])("rejects invalid coordinates or radius: %s", async (query) => {
    const response = await request(app).get(`/stations?${query}`);
    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(collection).not.toHaveBeenCalled();
  });

  it("returns an empty array when no stations are within the radius", async () => {
    const response = await request(app).get("/stations?lat=0&lng=0");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, stations: [] });
  });

  it("returns a controlled error when MongoDB cannot be read", async () => {
    toArray.mockRejectedValue(new Error("Database unavailable"));
    const response = await request(app).get("/stations");
    expect(response.status).toBe(503);
    expect(response.body.ok).toBe(false);
    expect(response.body.stations).toBeUndefined();
  });
});
