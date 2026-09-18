import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/z-energy-db";

export const client = new MongoClient(uri);
export const db = client.db();