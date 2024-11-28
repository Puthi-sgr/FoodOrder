import express from "express";
import { Request, Response } from "express";
import { AdminRoute, VendorRoute } from "./routes/index";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGO_URI } from "./config";
import path from "path";
import errorHandler from "./middlewares/ErrorHandler";
const app = express();

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//multer image storage
app.use("/images", express.static(path.join(__dirname, "images")));

//data base connection
mongoose
  .connect(MONGO_URI!)
  .then((res) => console.log("Database connected"))
  .catch((err) => console.log("Error: ", err));

//error handling middleware
app.use(errorHandler);

//routes
app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);
app.listen(3000, () => {
  console.clear();
  console.log("Sever is listening port 3000");
});
