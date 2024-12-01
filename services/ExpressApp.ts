import express, { Application } from "express";
import { AdminRoute, VendorRoute, ShoppingRoute } from "../routes/index";
import bodyParser from "body-parser";
import path from "path";
import errorHandler from "../middlewares/ErrorHandler";

export default async (app: Application) => {
  //middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //multer image storage
  app.use("/images", express.static(path.join(__dirname, "images")));

  //error handling middleware
  app.use(errorHandler);

  //routes
  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);
  app.use("/shopping", ShoppingRoute);
  return app;
};
