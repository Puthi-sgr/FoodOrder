import express, { Request, Response, NextFunction } from "express";
import { VendorLogin, GetVendorProfile, UpdateVendorProfile, GetVendorService} from "../controllers/index";

const router = express.Router();

router.post("/login", VendorLogin);

router.post("/profile", GetVendorProfile);

router.patch("/profile", UpdateVendorProfile);

router.post("/service",  GetVendorService);

export { router as VendorRoute };
