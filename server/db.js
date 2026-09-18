import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDb(
  uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/z-energy-db",
) {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}

export function getDb() {
  if (!db) throw new Error("Database not connected. Call connectDb() first.");
  return db;
}

export function setApiDb(fakeDb) {
  db = fakeDb;
}