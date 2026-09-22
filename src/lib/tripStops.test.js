import { describe, it, expect } from "vitest";
import { recommendStops } from "./tripStops.js";

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