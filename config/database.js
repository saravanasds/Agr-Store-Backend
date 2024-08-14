import mongoose from "mongoose";

export function dataBaseConnection() {

  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGODB_URI);
    
    console.log("MongoDB connected sucessfully");
  } catch (error) {
    console.log("MongoDB Connection Failed", error);
  }
}
