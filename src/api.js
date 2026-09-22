
async function readJson(response) {
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Request failed.");
  }
  return payload;
}

export async function listTrips(userId) {
  const response = await fetch(
    `/api/trips?userId=${encodeURIComponent(userId)}`,
  );
  const payload = await readJson(response);
  return payload.trips;
}

export async function saveTrip(trip) {
  const response = await fetch("/api/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trip),
  });
  return readJson(response);
}

export async function deleteTrip(id, userId) {
  const response = await fetch(
    `/api/trips/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`,
    { method: "DELETE" },
  );
  return readJson(response);
}

export async function planRoute({ from, to, stops = [] }) {
  const response = await fetch("/api/route", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, stops }),
  });
  return readJson(response);
}

export async function listStations() {
  const response = await fetch("/api/stations");
  const payload = await readJson(response);
  return payload.stations;
}