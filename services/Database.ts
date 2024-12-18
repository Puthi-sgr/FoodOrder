import { MONGO_URI } from "../config";
import mongoose from "mongoose";

export default async () => {
  try {
    //data base connection
    await mongoose
      .connect(MONGO_URI!)
      .then((res) => console.log("Database connected"))
      .catch((err) => console.log("Error: ", err));
  } catch (ex: any) {
    console.log(ex.message);
  }
};
