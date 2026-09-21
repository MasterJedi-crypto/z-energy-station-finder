import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../index.js";
import { setApiDb } from "../db.js";
import { createMemoryDb } from "./memoryDb.js";

describe("auth API", () => {
  afterEach(() => {
    setApiDb(null);
  });

  it("returns 503 for register when Mongo is down", async () => {
    setApiDb(null);
    const response = await request(app).post("/auth/register").send({
      email: "jasmina@z.co.nz",
      password: "secret1",
      confirmPassword: "secret1",
      accountType: "personal",
    });
    expect(response.status).toBe(503);
    expect(response.body.ok).toBe(false);
  });

  describe("with an in-memory database", () => {
    beforeEach(() => {
      setApiDb(createMemoryDb());
    });

    it("validates register payloads then creates a session", async () => {
      expect((await request(app).post("/auth/register").send({})).body.error).toBe(
        "Enter an email address.",
      );
      expect(
        (await request(app).post("/auth/register").send({ email: "jasmina@z.co.nz" }))
          .body.error,
      ).toBe("Enter a password.");
      expect(
        (
          await request(app)
            .post("/auth/register")
            .send({
              email: "jasmina@z.co.nz",
              password: "123",
              confirmPassword: "123",
            })
        ).body.error,
      ).toBe("Password must be at least 6 characters.");
      expect(
        (
          await request(app).post("/auth/register").send({
            email: "jasmina@z.co.nz",
            password: "secret1",
            confirmPassword: "nope",
          })
        ).body.error,
      ).toBe("Passwords do not match.");

      const created = await request(app).post("/auth/register").send({
        email: "Jasmina@Z.co.nz",
        name: "Jasmina",
        userId: "jasmina",
        password: "secret1",
        confirmPassword: "secret1",
        accountType: "personal",
      });
      expect(created.body).toEqual({
        ok: true,
        session: {
          userId: "jasmina",
          email: "jasmina@z.co.nz",
          name: "Jasmina",
          accountType: "personal",
          avatarUrl: null,
          businessName: null,
        },
      });

      const duplicate = await request(app).post("/auth/register").send({
        email: "jasmina@z.co.nz",
        password: "secret1",
        confirmPassword: "secret1",
        accountType: "personal",
      });
      expect(duplicate.body.error).toBe("That email already has a logon.");
    });

    it("registers a business profile and blocks the personal login", async () => {
      const created = await request(app).post("/auth/register").send({
        email: "fleet@z.co.nz",
        name: "Alex Fleet",
        userId: "fleet",
        password: "secret1",
        confirmPassword: "secret1",
        accountType: "business",
        businessName: "Z Fleet Ltd",
      });
      expect(created.body.session).toMatchObject({
        userId: "fleet",
        email: "fleet@z.co.nz",
        name: "Alex Fleet",
        accountType: "business",
        businessName: "Z Fleet Ltd",
      });

      const wrongTier = await request(app).post("/auth/login").send({
        email: "fleet@z.co.nz",
        password: "secret1",
        accountType: "personal",
      });
      expect(wrongTier.body.error).toBe("This logon is for Business accounts.");

      const login = await request(app).post("/auth/login").send({
        email: "fleet@z.co.nz",
        password: "secret1",
        accountType: "business",
      });
      expect(login.body.ok).toBe(true);
      expect(login.body.session.businessName).toBe("Z Fleet Ltd");
    });

    it("logs in and rejects bad credentials", async () => {
      await request(app).post("/auth/register").send({
        email: "driver@z.co.nz",
        name: "Driver",
        userId: "driver",
        password: "secret1",
        confirmPassword: "secret1",
        accountType: "personal",
      });

      expect((await request(app).post("/auth/login").send({})).body.error).toBe(
        "Enter your email and password.",
      );
      expect(
        (
          await request(app)
            .post("/auth/login")
            .send({ email: "missing@z.co.nz", password: "secret1" })
        ).body.error,
      ).toMatch(/No logon found/);
      expect(
        (
          await request(app)
            .post("/auth/login")
            .send({ email: "driver@z.co.nz", password: "wrong-password" })
        ).body.error,
      ).toBe("Incorrect password.");

      const login = await request(app)
        .post("/auth/login")
        .send({ userId: "Driver", password: "secret1", accountType: "personal" });
      expect(login.body.ok).toBe(true);
      expect(login.body.session.userId).toBe("driver");
      expect(login.body.session.name).toBe("Driver");
      expect(login.body.session.email).toBe("driver@z.co.nz");
    });

    it("resets a password for an existing user", async () => {
      await request(app).post("/auth/register").send({
        email: "driver@z.co.nz",
        name: "Driver",
        userId: "driver",
        password: "secret1",
        confirmPassword: "secret1",
        accountType: "personal",
      });

      expect((await request(app).post("/auth/reset").send({})).body.error).toBe(
        "Enter your email.",
      );
      expect(
        (
          await request(app).post("/auth/reset").send({
            email: "driver@z.co.nz",
            password: "123",
            confirmPassword: "123",
          })
        ).body.error,
      ).toBe("Password must be at least 6 characters.");
      expect(
        (
          await request(app).post("/auth/reset").send({
            email: "driver@z.co.nz",
            password: "secret2",
            confirmPassword: "other",
          })
        ).body.error,
      ).toBe("Passwords do not match.");
      expect(
        (
          await request(app).post("/auth/reset").send({
            email: "ghost@z.co.nz",
            password: "secret2",
            confirmPassword: "secret2",
          })
        ).body.error,
      ).toBe("No logon found for that email.");

      const reset = await request(app).post("/auth/reset").send({
        email: "driver@z.co.nz",
        password: "secret2",
        confirmPassword: "secret2",
      });
      expect(reset.body).toEqual({ ok: true });

      const login = await request(app)
        .post("/auth/login")
        .send({ email: "driver@z.co.nz", password: "secret2" });
      expect(login.body.ok).toBe(true);
    });

    it("resets a password by userId", async () => {
      await request(app).post("/auth/register").send({
        email: "driver@z.co.nz",
        name: "Driver",
        userId: "driver",
        password: "secret1",
        confirmPassword: "secret1",
        accountType: "personal",
      });

      const reset = await request(app).post("/auth/reset").send({
        userId: "driver",
        password: "secret2",
        confirmPassword: "secret2",
      });
      expect(reset.body).toEqual({ ok: true });

      const login = await request(app)
        .post("/auth/login")
        .send({ userId: "driver", password: "secret2" });
      expect(login.body.ok).toBe(true);
    });

    it("stores an avatar on the user and returns it in the session", async () => {
      await request(app).post("/auth/register").send({
        email: "driver@z.co.nz",
        name: "Driver",
        userId: "driver",
        password: "secret1",
        confirmPassword: "secret1",
        accountType: "personal",
      });
      const photo =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
      expect((await request(app).post("/auth/avatar").send({})).body.error).toBe(
        "Log in to upload a photo.",
      );
      expect(
        (
          await request(app)
            .post("/auth/avatar")
            .send({ email: "driver@z.co.nz", avatarUrl: "not-an-image" })
        ).body.error,
      ).toMatch(/photo/);
      const saved = await request(app).post("/auth/avatar").send({
        email: "driver@z.co.nz",
        avatarUrl: photo,
      });
      expect(saved.body.ok).toBe(true);
      expect(saved.body.session.avatarUrl).toBe(photo);
    });
  });
});
