const USERS_KEY = "z-auth-users";
const BUSINESS_KEY = "z-auth-business";
const SESSION_KEY = "z-auth-session";

function loadUsers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadBusinessProfiles() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BUSINESS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBusinessProfiles(profiles) {
  localStorage.setItem(BUSINESS_KEY, JSON.stringify(profiles));
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function normalizeUserId(userId) {
  return (userId || "").trim().toLowerCase();
}

export function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

export function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value || "").trim());
}

export function userIdFromEmail(email) {
  const local = normalizeEmail(email).split("@")[0].replace(/[^a-z0-9]+/g, "");
  return local || "user";
}

export function displayNameFromUserId(userId) {
  const raw = (userId || "").trim();
  if (!raw) return "Guest";
  const local = raw.split("@")[0].replace(/[._-]+/g, " ");
  return local
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeAccountType(value) {
  return value === "business" ? "business" : "personal";
}

export function headerDisplayName(session) {
  const name = (session?.name || "").trim();
  if (name) return name.split(/\s+/)[0];
  return "";
}

export function loginMenuOptions(accountType) {
  if (normalizeAccountType(accountType) === "business") {
    return [
      {
        id: "charging",
        title: "Business Charging Online",
        subtitle: "Manage your EV cards",
      },
      {
        id: "fuel",
        title: "Z Business Online",
        subtitle: "Manage your fuel cards",
      },
    ];
  }
  return [
    {
      id: "charging",
      title: "Personal Charging Online",
      subtitle: "Manage your EV cards",
    },
    {
      id: "fuel",
      title: "Z Personal Online",
      subtitle: "Manage your fuel cards",
    },
  ];
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

function findLocalUser(login) {
  const email = normalizeEmail(login);
  const userId = normalizeUserId(login);
  const users = loadUsers();
  return (
    users.find((user) => user.email === email) ||
    users.find((user) => user.userId === userId) ||
    null
  );
}

function uniqueLocalUserId(preferred) {
  const users = loadUsers();
  let candidate = preferred;
  let suffix = 2;
  while (users.some((user) => user.userId === candidate)) {
    candidate = `${preferred}${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function randomSalt() {
  return [...crypto.getRandomValues(new Uint8Array(16))]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function apiAuth(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function registerAccount({
  email,
  userId,
  name,
  password,
  confirmPassword,
  accountType,
  businessName,
  avatarUrl,
}) {
  const payload = {
    email,
    userId,
    name,
    password,
    confirmPassword,
    accountType,
    businessName,
    avatarUrl,
  };
  try {
    const result = await apiAuth("/api/auth/register", payload);
    if (result.ok) setSession(result.session);
    if (result.ok || result.error) return result;
  } catch {
    /* fall through to local backup */
  }
  const type = normalizeAccountType(accountType);
  const mail = normalizeEmail(email) || (looksLikeEmail(userId) ? normalizeEmail(userId) : "");
  if (!mail || !looksLikeEmail(mail)) {
    return { ok: false, error: "Enter an email address." };
  }
  if (!password) return { ok: false, error: "Enter a password." };
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  if (password !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }
  const company = (businessName || "").trim();
  if (type === "business" && !company) {
    return { ok: false, error: "Enter a business name." };
  }
  const users = loadUsers();
  if (users.some((user) => user.email === mail)) {
    return { ok: false, error: "That email already has a logon." };
  }
  const preferredId = normalizeUserId(userId) || userIdFromEmail(mail);
  if (normalizeUserId(userId) && users.some((user) => user.userId === preferredId)) {
    return { ok: false, error: "That User ID already has a logon." };
  }
  const id = uniqueLocalUserId(preferredId);
  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);
  const displayName = (name || "").trim() || displayNameFromUserId(mail);
  const user = {
    userId: id,
    email: mail,
    accountType: type,
    name: displayName,
    avatarUrl: avatarUrl || null,
    passwordHash,
    salt,
    createdAt: Date.now(),
  };
  users.push(user);
  saveUsers(users);
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
    saveBusinessProfiles([...loadBusinessProfiles(), profile]);
  }
  const session = toSession(user, profile);
  setSession(session);
  return { ok: true, session };
}

export async function loginAccount({ email, userId, password, accountType }) {
  const payload = { email, userId, password, accountType };
  try {
    const result = await apiAuth("/api/auth/login", payload);
    if (result.ok) setSession(result.session);
    if (result.ok || result.error) return result;
  } catch {
    /* fall through to local backup */
  }
  const login = email || userId;
  const type = normalizeAccountType(accountType);
  if (!login || !password) {
    return { ok: false, error: "Enter your email and password." };
  }
  const user = findLocalUser(login);
  if (!user) {
    return {
      ok: false,
      error: "No logon found. Request a Logon to create an account.",
    };
  }
  const storedType = user.accountType || "personal";
  if (storedType !== type) {
    const label = storedType === "business" ? "Business" : "Personal";
    return { ok: false, error: `This logon is for ${label} accounts.` };
  }
  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    return { ok: false, error: "Incorrect password." };
  }
  const profile =
    storedType === "business"
      ? loadBusinessProfiles().find((item) => item.userId === user.userId)
      : null;
  const session = toSession(user, profile);
  setSession(session);
  return { ok: true, session };
}

export async function resetPassword({ email, userId, password, confirmPassword }) {
  const payload = { email, userId, password, confirmPassword };
  try {
    const result = await apiAuth("/api/auth/reset", payload);
    if (result.ok || result.error) return result;
  } catch {
    /* fall through to local backup */
  }
  const login = email || userId;
  if (!login) return { ok: false, error: "Enter your email." };
  if (!password || password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  if (password !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }
  const users = loadUsers();
  const user = findLocalUser(login);
  if (!user) {
    return { ok: false, error: "No logon found for that email." };
  }
  const salt = randomSalt();
  const index = users.findIndex((item) => item.userId === user.userId);
  users[index] = {
    ...users[index],
    salt,
    passwordHash: await hashPassword(password, salt),
  };
  saveUsers(users);
  return { ok: true };
}

export function isAvatarDataUrl(value) {
  return (
    typeof value === "string" &&
    /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value) &&
    value.length < 900_000
  );
}

export async function readAvatarFile(file) {
  if (!file || !String(file.type || "").startsWith("image/")) {
    throw new Error("Choose a photo file.");
  }
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
  if (typeof Image === "undefined" || typeof document === "undefined") {
    return dataUrl;
  }
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const min = Math.min(image.width, image.height) || size;
      const sx = (image.width - min) / 2;
      const sy = (image.height - min) / 2;
      ctx.drawImage(image, sx, sy, min, min, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.onerror = () => reject(new Error("Could not read that photo."));
    image.src = dataUrl;
  });
}

export async function updateAvatar({ email, userId, file, avatarUrl }) {
  let url = avatarUrl;
  try {
    if (file) url = await readAvatarFile(file);
  } catch (error) {
    return { ok: false, error: error.message };
  }
  if (!isAvatarDataUrl(url)) {
    return { ok: false, error: "Choose a photo (JPG, PNG, or WebP)." };
  }
  const payload = { email, userId, avatarUrl: url };
  try {
    const result = await apiAuth("/api/auth/avatar", payload);
    if (result.ok) setSession(result.session);
    if (result.ok || result.error) return result;
  } catch {
    /* fall through to local backup */
  }
  const user = findLocalUser(email || userId);
  if (!user) {
    const session = getSession();
    if (!session) return { ok: false, error: "Log in to upload a photo." };
    const next = { ...session, avatarUrl: url };
    setSession(next);
    return { ok: true, session: next };
  }
  const users = loadUsers();
  const index = users.findIndex((item) => item.userId === user.userId);
  users[index] = { ...users[index], avatarUrl: url };
  saveUsers(users);
  const profile =
    user.accountType === "business"
      ? loadBusinessProfiles().find((item) => item.userId === user.userId)
      : null;
  const session = toSession({ ...user, avatarUrl: url }, profile);
  setSession(session);
  return { ok: true, session };
}
