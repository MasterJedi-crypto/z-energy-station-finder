import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearSession,
  displayNameFromUserId,
  getSession,
  headerDisplayName,
  loginAccount,
  loginMenuOptions,
  normalizeEmail,
  normalizeUserId,
  registerAccount,
  resetPassword,
  setSession,
  updateAvatar,
} from "./auth.js";

function jsonResponse(body) {
  return {
    ok: true,
    json: async () => body,
  };
}

const personalAccount = {
  email: "local-user@z.co.nz",
  name: "Local User",
  userId: "local-user",
  password: "secret1",
  confirmPassword: "secret1",
  accountType: "personal",
};

describe("auth API helpers", () => {
  let store;

  beforeEach(() => {
    store = {};
    globalThis.localStorage = {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
    };
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("normalizes ids, emails, header names, and login labels", () => {
    expect(normalizeUserId("  Jasmina@Z.co.nz ")).toBe("jasmina@z.co.nz");
    expect(normalizeEmail("  Jasmina@Z.co.nz ")).toBe("jasmina@z.co.nz");
    expect(displayNameFromUserId("")).toBe("Guest");
    expect(displayNameFromUserId("jasmina.salvador@z.co.nz")).toBe(
      "Jasmina Salvador",
    );
    expect(
      headerDisplayName({ name: "Rodrigo Nunes", email: "rodrigo@z.co.nz" }),
    ).toBe("Rodrigo");
    expect(loginMenuOptions("personal")[1].title).toBe("Z Personal Online");
    expect(loginMenuOptions("business")[0].title).toBe(
      "Business Charging Online",
    );
  });

  it("stores and clears a session", () => {
    setSession({ userId: "driver", name: "Driver" });
    expect(getSession()).toEqual({ userId: "driver", name: "Driver" });
    clearSession();
    expect(getSession()).toBeNull();
  });

  it("uses the API when register succeeds", async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse({
        ok: true,
        session: {
          userId: "driver",
          email: "driver@z.co.nz",
          name: "Driver",
          accountType: "personal",
          avatarUrl: null,
          businessName: null,
        },
      }),
    );
    const result = await registerAccount({
      email: "driver@z.co.nz",
      name: "Driver",
      password: "secret1",
      confirmPassword: "secret1",
      accountType: "personal",
    });
    expect(result.ok).toBe(true);
    expect(getSession().name).toBe("Driver");
    expect(getSession().email).toBe("driver@z.co.nz");
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("falls back to localStorage when the auth API is unreachable", async () => {
    fetch.mockRejectedValue(new Error("offline"));

    const created = await registerAccount(personalAccount);
    expect(created.ok).toBe(true);
    expect(getSession().userId).toBe("local-user");
    expect(getSession().email).toBe("local-user@z.co.nz");
    expect(getSession().name).toBe("Local User");

    expect((await registerAccount(personalAccount)).error).toBe(
      "That email already has a logon.",
    );

    const login = await loginAccount({
      email: "local-user@z.co.nz",
      password: "secret1",
      accountType: "personal",
    });
    expect(login.ok).toBe(true);

    expect(
      (
        await loginAccount({
          email: "local-user@z.co.nz",
          password: "nope-nope",
          accountType: "personal",
        })
      ).error,
    ).toBe("Incorrect password.");
    expect(
      (
        await loginAccount({
          email: "missing@z.co.nz",
          password: "secret1",
          accountType: "personal",
        })
      ).error,
    ).toMatch(/No logon found/);
    expect(
      (
        await loginAccount({
          email: "local-user@z.co.nz",
          password: "secret1",
          accountType: "business",
        })
      ).error,
    ).toMatch(/Personal/);

    const reset = await resetPassword({
      email: "local-user@z.co.nz",
      password: "secret2",
      confirmPassword: "secret2",
    });
    expect(reset).toEqual({ ok: true });

    const relogin = await loginAccount({
      userId: "local-user",
      password: "secret2",
      accountType: "personal",
    });
    expect(relogin.ok).toBe(true);
  });

  it("resets a password by userId when the API is offline", async () => {
    fetch.mockRejectedValue(new Error("offline"));
    await registerAccount(personalAccount);
    const reset = await resetPassword({
      userId: "local-user",
      password: "secret2",
      confirmPassword: "secret2",
    });
    expect(reset).toEqual({ ok: true });
    const relogin = await loginAccount({
      userId: "local-user",
      password: "secret2",
      accountType: "personal",
    });
    expect(relogin.ok).toBe(true);
  });

  it("stores a business profile on local register", async () => {
    fetch.mockRejectedValue(new Error("offline"));
    const created = await registerAccount({
      email: "fleet@z.co.nz",
      name: "Alex Fleet",
      userId: "fleet",
      password: "secret1",
      confirmPassword: "secret1",
      accountType: "business",
      businessName: "Z Fleet Ltd",
    });
    expect(created.session).toMatchObject({
      userId: "fleet",
      email: "fleet@z.co.nz",
      name: "Alex Fleet",
      accountType: "business",
      businessName: "Z Fleet Ltd",
    });
  });

  it("saves an avatar on the local session", async () => {
    fetch.mockRejectedValue(new Error("offline"));
    await registerAccount(personalAccount);
    const photo =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const result = await updateAvatar({
      email: "local-user@z.co.nz",
      avatarUrl: photo,
    });
    expect(result.ok).toBe(true);
    expect(getSession().avatarUrl).toBe(photo);
    expect((await updateAvatar({ email: "local-user@z.co.nz" })).error).toMatch(
      /photo/,
    );
  });

  it("validates local register and reset payloads", async () => {
    fetch.mockRejectedValue(new Error("offline"));
    expect((await registerAccount({})).error).toBe("Enter an email address.");
    expect((await registerAccount({ email: "a@z.co.nz" })).error).toBe(
      "Enter a password.",
    );
    expect(
      (
        await registerAccount({
          email: "a@z.co.nz",
          password: "123",
          confirmPassword: "123",
        })
      ).error,
    ).toBe("Password must be at least 6 characters.");
    expect(
      (
        await registerAccount({
          email: "a@z.co.nz",
          password: "secret1",
          confirmPassword: "other",
        })
      ).error,
    ).toBe("Passwords do not match.");
    expect(
      (
        await registerAccount({
          email: "biz@z.co.nz",
          password: "secret1",
          confirmPassword: "secret1",
          accountType: "business",
        })
      ).error,
    ).toBe("Enter a business name.");
    expect((await resetPassword({})).error).toBe("Enter your email.");
    expect(
      (
        await resetPassword({
          email: "a@z.co.nz",
          password: "123",
          confirmPassword: "123",
        })
      ).error,
    ).toBe("Password must be at least 6 characters.");
    expect(
      (
        await resetPassword({
          email: "a@z.co.nz",
          password: "secret1",
          confirmPassword: "other",
        })
      ).error,
    ).toBe("Passwords do not match.");
    expect(
      (
        await resetPassword({
          email: "ghost@z.co.nz",
          password: "secret1",
          confirmPassword: "secret1",
        })
      ).error,
    ).toBe("No logon found for that email.");
  });
});
