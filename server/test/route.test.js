import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { createRouteRouter } from "../routes/route.js";

function makeApp(fetchFn) {
  const app = express();
  app.use(express.json());
  app.use("/route", createRouteRouter({ fetchFn }));
  return app;
}

// Fake fetch: answers based on what the URL contains
function fakeFetch(answers) {
  return async (url) => {
    const match = answers.find(([pattern]) => url.includes(pattern));
    if (!match) return { ok: false, json: async () => ({}) };
    return { ok: true, json: async () => match[1] };
  };
}

const christchurch = [{ lat: "-43.53", lon: "172.63" }];
const queenstown = [{ lat: "-45.03", lon: "168.66" }];
const osrmRoute = {
  routes: [
    {
      distance: 491000,
      duration: 16200,
      geometry: { coordinates: [[172.63, -43.53], [168.66, -45.03]] },
    },
  ],
};

describe("POST /route", () => {
  it("returns 400 when from or to is missing", async () => {
    const app = makeApp(fakeFetch([]));
    const response = await request(app).post("/route").send({ from: "Christchurch" });
    expect(response.status).toBe(400);
  });

  it("returns distance, duration and the path", async () => {
    const app = makeApp(
      fakeFetch([
        ["q=Christchurch", christchurch],
        ["q=Queenstown", queenstown],
        ["router.project-osrm.org", osrmRoute],
      ]),
    );
    const response = await request(app)
      .post("/route")
      .send({ from: "Christchurch", to: "Queenstown" });

    expect(response.status).toBe(200);
    expect(response.body.distanceKm).toBe(491);
    expect(response.body.durationMin).toBe(270);
    expect(response.body.durationLabel).toBe("4h 30min");
    expect(response.body.path[0]).toEqual({ lat: -43.53, lng: 172.63 });
  });

  it("returns 404 when a place can't be found", async () => {
    const app = makeApp(
      fakeFetch([
        ["q=Christchurch", christchurch],
        ["q=Nowhere", []],
      ]),
    );
    const response = await request(app)
      .post("/route")
      .send({ from: "Christchurch", to: "Nowhere" });

    expect(response.status).toBe(404);
    expect(response.body.ok).toBe(false);
  });
});