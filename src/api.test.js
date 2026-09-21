import { describe, it, expect, vi, afterEach } from "vitest";
import { listTrips, saveTrip, deleteTrip } from "./api.js";
import { listTrips, saveTrip, deleteTrip, planRoute } from "./api.js";

function mockFetch(body, ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({ ok, json: async () => body });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("listTrips", () => {
  it("calls GET /api/trips with the userId and returns the trips", async () => {
    const fetchMock = mockFetch({ ok: true, trips: [{ to: "Timaru" }] });
    const trips = await listTrips("user1");
    expect(fetchMock).toHaveBeenCalledWith("/api/trips?userId=user1");
    expect(trips).toEqual([{ to: "Timaru" }]);
  });

  it("throws when the API returns an error", async () => {
    mockFetch({ ok: false, error: "userId is required." }, false);
    await expect(listTrips("")).rejects.toThrow("userId is required.");
  });
});

describe("saveTrip", () => {
  it("POSTs the trip as JSON", async () => {
    const fetchMock = mockFetch({ ok: true, id: "trip-1" });
    const trip = { userId: "user1", from: "Christchurch", to: "Timaru" };
    const result = await saveTrip(trip);
    expect(fetchMock).toHaveBeenCalledWith("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip),
    });
    expect(result.id).toBe("trip-1");
  });
});

describe("deleteTrip", () => {
  it("sends DELETE with the trip id and userId", async () => {
    const fetchMock = mockFetch({ ok: true });
    await deleteTrip("abc123", "user1");
    expect(fetchMock).toHaveBeenCalledWith("/api/trips/abc123?userId=user1", {
      method: "DELETE",
    });
  });
});

describe("planRoute", () => {
  it("POSTs from, to and stops and returns the route", async () => {
    const fetchMock = mockFetch({ ok: true, distanceKm: 491, durationLabel: "4h 30min" });
    const result = await planRoute({ from: "Christchurch", to: "Queenstown", stops: [] });
    expect(fetchMock).toHaveBeenCalledWith("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Christchurch", to: "Queenstown", stops: [] }),
    });
    expect(result.distanceKm).toBe(491);
  });
});