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
   expect(Array.isArray(response.body)).toBe(true);
expect(response.body.length).toBeGreaterThan(0);
  });
  it("returns Wellington when searched", async () => {
  const response = await request(app).get("/geocode?q=Wellington");
  expect(response.status).toBe(200);
  expect(response.body[0].name).toContain("Wellington");
});
});

