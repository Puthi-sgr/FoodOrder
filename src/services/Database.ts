import dotenv from "dotenv";
dotenv.config();
import { MONGO_URI } from "../config/index";
import mongoose from "mongoose";

export default async () => {
  console.log("Mongo URI: ", MONGO_URI);
  try {
    //data base connection
    await mongoose
      .connect(MONGO_URI!, {
        serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
      })
      .then((res) => console.log("Database connected"))
      .catch((err) => console.log("Error: ", err));
  } catch (ex: any) {
    console.log(ex.message);
  }
};
