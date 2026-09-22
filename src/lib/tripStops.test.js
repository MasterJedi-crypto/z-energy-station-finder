

import { describe, it, expect } from "vitest";
import { recommendStops } from "./tripStops.js";
import { googleMapsUrl, recommendStops } from "./tripStops.js";

const stations = [
  { id: "a", price: 2.4, services: ["coffee", "toilets"] },
  { id: "b", price: 2.2, services: ["coffee"] },
  { id: "c", price: 2.3, services: ["coffee", "toilets", "24-7"] },
];

describe("recommendStops", () => {
  it("keeps route order when nothing is selected", () => {
    expect(recommendStops(stations).map((s) => s.id)).toEqual(["a", "b", "c"]);
  });

  it("only keeps stations with every selected service", () => {
    const result = recommendStops(stations, ["coffee", "toilets"]);
    expect(result.map((s) => s.id)).toEqual(["a", "c"]);
  });

  it("puts the cheapest first when cheapest is on", () => {
    const result = recommendStops(stations, [], true);
    expect(result.map((s) => s.id)).toEqual(["b", "c", "a"]);
  });
});

describe("googleMapsUrl", () => {
  const origin = { lat: -43.5, lng: 172.6 };
  const destination = { lat: -45, lng: 168.7 };

  it("builds a driving directions link", () => {
    const url = googleMapsUrl(origin, destination);
    expect(url).toContain("https://www.google.com/maps/dir/?");
    expect(url).toContain("origin=-43.5%2C172.6");
    expect(url).toContain("destination=-45%2C168.7");
    expect(url).toContain("travelmode=driving");
    expect(url).not.toContain("waypoints");
  });

  it("adds stops as waypoints in order", () => {
    const url = googleMapsUrl(origin, destination, [
      { lat: -44, lng: 171 },
      { lat: -44.5, lng: 170 },
    ]);
    expect(url).toContain("waypoints=-44%2C171%7C-44.5%2C170");
  });
});