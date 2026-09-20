import { connectDb, closeDb } from "./db.js";
import { stationSeeds } from "./data/stations.js";

try {
  const db = await connectDb();
  const stations = db.collection("stations");
  await stations.createIndex({ id: 1 }, { unique: true });
  const result = await stations.bulkWrite(
    stationSeeds.map((station) => ({
      updateOne: {
        filter: { id: station.id },
        update: { $set: station },
        upsert: true,
      },
    })),
  );
  console.log(
    `Seeded ${stationSeeds.length} station records in ${db.databaseName}.stations ` +
      `(${result.upsertedCount} inserted, ${result.modifiedCount} updated).`,
  );
} catch {
  console.error("Station seed failed. Check that MongoDB is running and MONGODB_URI is correct.");
  process.exitCode = 1;
} finally {
  await closeDb();
}
