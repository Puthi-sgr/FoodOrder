import express, { Request, Response, NextFunction } from "express";
import {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
  AddFood,
  GetFoods,
} from "../controllers/index";
import { Authenticate } from "../middlewares/CommonAuth";

const router = express.Router();

router.post("/login", VendorLogin);

router.get("/profile", Authenticate, GetVendorProfile);

router.patch("/profile", Authenticate, UpdateVendorProfile);

router.patch("/service", Authenticate, UpdateVendorService);

router.post("/food", Authenticate, AddFood);

router.get("/foods", Authenticate, GetFoods);

export { router as VendorRoute };
