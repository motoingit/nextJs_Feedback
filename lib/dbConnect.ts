import mongoose from "mongoose";


type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {

  // Check if we have a connection to the database or not
  if(connection.isConnected){
    console.log("Already Connected To Database");
    return;
  }

  // Trying to Connect with Mongodb Database
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URI || '');

    //todo: just see this console for learning purposes
    // console.log(db);

    //* pointing to defeat  connection { db.connections[0] }
    connection.isConnected = db.connection.readyState;
    console.log(`Connection State of isConnected : ${connection.isConnected}`);

    console.log("Database COnnected Sucessfuly");

  } catch (dbConnetionError) {
    console.error(`Database Connection Failded : ErrorString - ${dbConnetionError}`);
    throw dbConnetionError;
    // process.exit(1);
  }
}

export default dbConnect;
