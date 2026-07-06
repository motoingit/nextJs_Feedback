import mongoose from "mongoose";


type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

//* Void in cpp is diffrent from void here {yeha pe muje parva nahi hai ki kis tarha ka datatype ara hai}
async function dbConnect(): Promise<void> {

  //* Optimisation for doudging Choking and performence issue
  if(connection.isConnected){
    console.log("Already Connected To Database");
    return;
  }

  try {
    //todo: Empty hadingling req
    const db = await mongoose.connect(process.env.MONGO_DB_URI || '', {});

    //* check for reading/expore
    console.log(db);
    connection.isConnected = db.connections[0].readyState;
    console.log(connection.isConnected);

    console.log("Database COnnected Sucessfuly");

  } catch (error) {
    console.error("Databse cannection Failded", error);
    process.exit(1);
  }
}

export default dbConnect;
