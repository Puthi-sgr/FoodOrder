import express, { Request, Response, NextFunction } from "express";
import {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
  AddFood,
  GetFoods,
  UpdateCoverImages,
} from "../controllers/index";
import { Authenticate } from "../middlewares/CommonAuth";
import multer from "multer";
import path from "path";
import fs from "fs";
const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const imagePath = path.join(process.cwd(), "images");
    cb(null, imagePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random());
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});
const images = multer({ storage: imageStorage }).array("images", 10);
router.post("/login", VendorLogin);

router.get("/profile", Authenticate, GetVendorProfile);

router.patch("/profile", Authenticate, UpdateVendorProfile);

router.patch("/cover", Authenticate, images, UpdateCoverImages);

router.patch("/service", Authenticate, UpdateVendorService);

router.post("/food", Authenticate, images, AddFood);

router.get("/foods", Authenticate, GetFoods);

export { router as VendorRoute };
