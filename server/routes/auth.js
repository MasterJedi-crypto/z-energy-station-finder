import { Router } from "express";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const USERS = "user-credentials";
const BUSINESS = "business-profiles";

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 32).toString("hex");
  return { salt, hash };
}

function passwordsMatch(password, salt, expectedHash) {
  const actual = scryptSync(password, salt, 32);
  const expected = Buffer.from(expectedHash, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

function normalizeUserId(userId) {
  return (userId || "").trim().toLowerCase();
}

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || "").trim());
}

function userIdFromEmail(email) {
  const local = normalizeEmail(email).split("@")[0].replace(/[^a-z0-9]+/g, "");
  return local || "user";
}

function displayNameFromUserId(userId) {
  const raw = (userId || "").trim();
  if (!raw) return "Guest";
  const local = raw.split("@")[0].replace(/[._-]+/g, " ");
  return local
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeAccountType(value) {
  return value === "business" ? "business" : "personal";
}

function toSession(user, profile) {
  return {
    userId: user.userId,
    email: user.email,
    name: user.name,
    accountType: user.accountType || "personal",
    avatarUrl: user.avatarUrl ?? null,
    businessName: profile?.businessName ?? null,
  };
}

function isAvatarDataUrl(value) {
  return (
    typeof value === "string" &&
    /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value) &&
    value.length < 900_000
  );
}

async function findCredential(db, login) {
  const email = normalizeEmail(login);
  const userId = normalizeUserId(login);
  if (email) {
    const byEmail = await db.collection(USERS).findOne({ email });
    if (byEmail) return byEmail;
  }
  if (userId) return db.collection(USERS).findOne({ userId });
  return null;
}

async function uniqueUserId(db, preferred) {
  let candidate = preferred;
  let suffix = 2;
  while (await db.collection(USERS).findOne({ userId: candidate })) {
    candidate = `${preferred}${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function loadSession(db, user) {
  const profile =
    user.accountType === "business"
      ? await db.collection(BUSINESS).findOne({ userId: user.userId })
      : null;
  return toSession(user, profile);
}

export async function ensureAuthIndexes(db) {
  await db.collection(USERS).createIndex({ userId: 1 }, { unique: true });
  await db.collection(USERS).createIndex({ email: 1 }, { unique: true });
  await db.collection(BUSINESS).createIndex({ userId: 1 }, { unique: true });
}

export function createAuthRouter(getDatabase) {
  const router = Router();

  function dbOr503(res) {
    try {
      const db = getDatabase();
      if (!db) throw new Error("not connected");
      return db;
    } catch {
      res.status(503).json({
        ok: false,
        error:
          "MongoDB is not connected. Start Compass on mongodb://127.0.0.1:27017.",
      });
      return null;
    }
  }

  router.post("/register", async (req, res) => {
    const db = dbOr503(res);
    if (!db) return;
    const {
      email,
      userId,
      name,
      password,
      confirmPassword,
      accountType,
      businessName,
      avatarUrl,
    } = req.body ?? {};
    const type = normalizeAccountType(accountType);
    const mail =
      normalizeEmail(email) ||
      (looksLikeEmail(userId) ? normalizeEmail(userId) : "");
    if (!mail || !looksLikeEmail(mail)) {
      return res.json({ ok: false, error: "Enter an email address." });
    }
    if (!password) return res.json({ ok: false, error: "Enter a password." });
    if (password.length < 6) {
      return res.json({
        ok: false,
        error: "Password must be at least 6 characters.",
      });
    }
    if (password !== confirmPassword) {
      return res.json({ ok: false, error: "Passwords do not match." });
    }
    const company = (businessName || "").trim();
    if (type === "business" && !company) {
      return res.json({ ok: false, error: "Enter a business name." });
    }
    if (await db.collection(USERS).findOne({ email: mail })) {
      return res.json({ ok: false, error: "That email already has a logon." });
    }
    const preferredId = normalizeUserId(userId) || userIdFromEmail(mail);
    if (
      normalizeUserId(userId) &&
      (await db.collection(USERS).findOne({ userId: preferredId }))
    ) {
      return res.json({ ok: false, error: "That User ID already has a logon." });
    }
    const id = await uniqueUserId(db, preferredId);
    const { salt, hash } = hashPassword(password);
    const displayName = (name || "").trim() || displayNameFromUserId(mail);
    const user = {
      userId: id,
      email: mail,
      accountType: type,
      name: displayName,
      avatarUrl: avatarUrl || null,
      passwordHash: hash,
      salt,
      createdAt: Date.now(),
    };
    await db.collection(USERS).insertOne(user);
    let profile = null;
    if (type === "business") {
      profile = {
        userId: id,
        businessName: company,
        legalName: "",
        gstNumber: "",
        fleetSize: "",
        createdAt: Date.now(),
      };
      await db.collection(BUSINESS).insertOne(profile);
    }
    res.json({ ok: true, session: toSession(user, profile) });
  });

  router.post("/login", async (req, res) => {
    const db = dbOr503(res);
    if (!db) return;
    const { email, userId, password, accountType } = req.body ?? {};
    const login = email || userId;
    const type = normalizeAccountType(accountType);
    if (!login || !password) {
      return res.json({
        ok: false,
        error: "Enter your email and password.",
      });
    }
    const user = await findCredential(db, login);
    if (!user) {
      return res.json({
        ok: false,
        error: "No logon found. Request a Logon to create an account.",
      });
    }
    const storedType = user.accountType || "personal";
    if (storedType !== type) {
      const label = storedType === "business" ? "Business" : "Personal";
      return res.json({
        ok: false,
        error: `This logon is for ${label} accounts.`,
      });
    }
    if (!passwordsMatch(password, user.salt, user.passwordHash)) {
      return res.json({ ok: false, error: "Incorrect password." });
    }
    res.json({
      ok: true,
      session: await loadSession(db, user),
    });
  });

  router.post("/reset", async (req, res) => {
    const db = dbOr503(res);
    if (!db) return;
    const { email, userId, password, confirmPassword } = req.body ?? {};
    const login = email || userId;
    if (!login) return res.json({ ok: false, error: "Enter your email." });
    if (!password || password.length < 6) {
      return res.json({
        ok: false,
        error: "Password must be at least 6 characters.",
      });
    }
    if (password !== confirmPassword) {
      return res.json({ ok: false, error: "Passwords do not match." });
    }
    const user = await findCredential(db, login);
    if (!user) {
      return res.json({ ok: false, error: "No logon found for that email." });
    }
    const { salt, hash } = hashPassword(password);
    await db.collection(USERS).updateOne(
      { userId: user.userId },
      { $set: { salt, passwordHash: hash } },
    );
    res.json({ ok: true });
  });

  router.post("/avatar", async (req, res) => {
    const db = dbOr503(res);
    if (!db) return;
    const { email, userId, avatarUrl } = req.body ?? {};
    const login = email || userId;
    if (!login) {
      return res.json({ ok: false, error: "Log in to upload a photo." });
    }
    if (!isAvatarDataUrl(avatarUrl)) {
      return res.json({
        ok: false,
        error: "Choose a photo (JPG, PNG, or WebP).",
      });
    }
    const user = await findCredential(db, login);
    if (!user) {
      return res.json({ ok: false, error: "No logon found for that email." });
    }
    await db.collection(USERS).updateOne(
      { userId: user.userId },
      { $set: { avatarUrl } },
    );
    user.avatarUrl = avatarUrl;
    res.json({ ok: true, session: await loadSession(db, user) });
  });

  return router;
}
