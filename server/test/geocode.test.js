import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../index.js";

describe("GET /geocode", () => {
  it("returns Auckland, Wellington, and Christchurch when empty", async () => {
    const response = await request(app).get("/geocode");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.places).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Auckland",
          lat: expect.any(Number),
          lng: expect.any(Number),
        }),
        expect.objectContaining({
          label: "Wellington",
          lat: expect.any(Number),
          lng: expect.any(Number),
        }),
        expect.objectContaining({
          label: "Christchurch",
          lat: expect.any(Number),
          lng: expect.any(Number),
        }),
      ]),
    );
  });

  it("returns Wellington when searched", async () => {
    const response = await request(app).get("/geocode?q=Wellington");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);

    const found = response.body.places.some((place) =>
      place.label.includes("Wellington"),
    );

    expect(found).toBe(true);
  });
});