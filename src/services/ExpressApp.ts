import express, { Application } from "express";
import {
  AdminRoute,
  VendorRoute,
  ShoppingRoute,
  CustomerRoute,
} from "../routes/index";
import bodyParser from "body-parser";
import path from "path";
import errorHandler from "../middlewares/ErrorHandler";
import cors from "cors";

export default async (app: Application) => {
  //middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(
  //   cors({
  //     origin: "http://localhost:3001",
  //   })
  // );
  //multer image storage
  app.use("/images", express.static(path.join(__dirname, "images")));

  //error handling middleware
  app.use(errorHandler);

  //routes
  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);
  app.use("/shopping", ShoppingRoute);
  app.use("/customer", CustomerRoute);
  return app;
};
