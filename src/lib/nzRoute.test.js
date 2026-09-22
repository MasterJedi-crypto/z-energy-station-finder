import { describe, it, expect } from "vitest";
import { haversineKm, stationsAlongRoute } from "./nzRoute.js";

describe("haversineKm", () => {
  it("measures one degree of latitude as about 111 km", () => {
    expect(haversineKm({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(111.19, 1);
  });
});

describe("stationsAlongRoute", () => {
  // A straight road along the equator, from lng 0 to lng 1 (~111 km)
  const path = Array.from({ length: 11 }, (_, i) => ({ lat: 0, lng: i / 10 }));

  it("keeps stations near the road and drops far ones", () => {
    const stations = [
      { id: "near", lat: 0.01, lng: 0.5 },
      { id: "far", lat: 1, lng: 0.5 },
    ];
    const result = stationsAlongRoute(path, stations);
    expect(result.map((s) => s.id)).toEqual(["near"]);
  });

  it("orders stations by how far along the route they are", () => {
    const stations = [
      { id: "later", lat: 0, lng: 0.9 },
      { id: "earlier", lat: 0, lng: 0.2 },
    ];
    const result = stationsAlongRoute(path, stations);
    expect(result.map((s) => s.id)).toEqual(["earlier", "later"]);
    expect(result[0].routeKm).toBe(22);
  });

  it("returns nothing for an empty route", () => {
    expect(stationsAlongRoute([], [{ id: "a", lat: 0, lng: 0 }])).toEqual([]);
  });
});