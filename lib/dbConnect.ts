import mongoose from "mongoose";
import chalk from "chalk";

/**
 * Interface representing the cached database connection structure.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Global cached connection reference to survive HMR/Hot Reload re-evaluations
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const connectionCache = global.mongoose;

/* Establishes a connection to the MongoDB database.
 * Reuses existing connections if already established to prevent exceeding pool limits in serverless env.
 * 
 * @returns A promise that resolves when the database is successfully connected or already connected.
 * @throws An error if the database connection fails.
 */
async function dbConnect(): Promise<void> {
  console.log(
    chalk.blue("[INFO]"),
    ">",
    "Checking database connection state..."
  );

  // 1. If connection already exists in global cache, reuse it
  if (connectionCache.conn) {
    console.log(
      chalk.green("[SUCCESS]"),
      ">",
      "Using cached active MongoDB connection."
    );
    return;
  }

  // 2. If no connection promise exists, establish a new one
  if (!connectionCache.promise) {
    console.log(
      chalk.blue("[INFO]"),
      ">",
      "Establishing new MongoDB connection..."
    );

    const mongoUri = process.env.DATABASE_API_KEY;
    if (!mongoUri) {
      throw new Error("DATABASE_API_KEY is not defined");
    }

    // This can make failures easier to detect, but it's not inherently a performance optimization.
    const opts = {
      bufferCommands: false,
    };

    connectionCache.promise = mongoose.connect(mongoUri, opts).then((m) => {
      console.log(
        chalk.green("[SUCCESS]"),
        ">",
        "Successfully connected to MongoDB."
      );
      return m;
    });
  }

  try {
    connectionCache.conn = await connectionCache.promise;
  } catch (dbConnectionError) {
    // Clear failed promise cache to allow retries on subsequent requests
    connectionCache.promise = null;

    console.error(
      chalk.red("[ERROR]"),
      ">",
      "Failed to connect to MongoDB:"
    );

    console.error(
      chalk.red(
        dbConnectionError instanceof Error ? dbConnectionError.stack : String(dbConnectionError)
      )
    );

    throw dbConnectionError;
  }
}

export default dbConnect;

