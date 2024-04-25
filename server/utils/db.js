import mongoose from "mongoose";

const uri = "mongodb://localhost:27017/your-database-name";

async function connectDB() {
  try {
    await mongoose.connect(uri, {});
    console.log("Connected to the database");
  } catch (err) {
    console.error("Failed to connect to the database", err);
  }
}

export default connectDB;
