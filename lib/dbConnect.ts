import mongoose from "mongoose";
import chalk from "chalk";

/**
 * Type representing the connection caching object.
 */
type ConnectionObject = {
  isConnected?: number;
};

// Cached connection object to reuse connections across serverless function invocations
const connection: ConnectionObject = {};

/**
 * Establishes a connection to the MongoDB database.
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

  // Check if we have a cached connection to the database
  if (connection.isConnected) {

    console.log(
      chalk.green("[SUCCESS]"),
      ">",
      "Using cached MongoDB connection."
    );

    return;
  }

  // Check Mongoose's global connection state as a fallback
  if (mongoose.connections.length > 0) {

    connection.isConnected = mongoose.connections[0].readyState;

    if (connection.isConnected === 1) {

      console.log(
        chalk.green("[SUCCESS]"),
        ">",
        "Using existing Mongoose global connection."
      );

      return;
    }
  }

  console.log(
    chalk.blue("[INFO]"),
    ">",
    "Establishing new MongoDB connection..."
  );
  
  try {
    // Attempt connection using the validated MONGO_DB_URI
    const mongoUri = process.env.MONGO_DB_URI;

    if (!mongoUri) {
      throw new Error("MONGO_DB_URI is not defined");
    }

    const db = await mongoose.connect(mongoUri);

    // Cache the connection ready state:
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    connection.isConnected = db.connections[0].readyState;
    
    console.log(
      chalk.green("[SUCCESS]"),
      ">",
      "Successfully connected to MongoDB."
    );
    
  } catch (dbConnectionError) {

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

