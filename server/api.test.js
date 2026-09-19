import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./index.js";

describe("GET /health", () => {
  it("returns 200 and { ok: true }", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});

describe("GET /geocode", () => {
  it("returns known NZ places when the query is empty", async () => {
    const response = await request(app).get("/geocode");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.places)).toBe(true);
    expect(response.body.places.length).toBeGreaterThan(0);

    expect(response.body.places[0]).toEqual(
      expect.objectContaining({
        label: expect.any(String),
        lat: expect.any(Number),
        lng: expect.any(Number),
      }),
    );
  });

  it("returns Wellington when searched", async () => {
    const response = await request(app).get("/geocode?q=Wellington");

    expect(response.status).toBe(200);

    const found = response.body.places.some((place) =>
      place.label.includes("Wellington"),
    );

    expect(found).toBe(true);
  });
});