import express, { Request, Response, NextFunction } from "express";
import { CreateVendor, GetVendor, GetVendorById } from "../controllers/index";

const router = express.Router();

router.post("/vendor", CreateVendor);

router.get("/vendors", GetVendor);
router.get("/vendor/:id", GetVendorById);

export { router as AdminRoute };
