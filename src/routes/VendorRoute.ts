import express, { Request, Response, NextFunction } from "express";
import {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
  AddFood,
  GetFoods,
  UpdateCoverImages,
  GetOrderDetails,
  ProcessOrder,
  GetCurrentOrders,
  GetOffers,
  AddOffer,
  EditOffer,
} from "../controllers/index";
import { Authenticate } from "../middlewares/CommonAuth";
import multer from "multer";
import path from "path";
import fs from "fs";
const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const imagePath = path.join(process.cwd(), "/src/images");
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

//------------ Order. Order received from the customer's order
router.get("/orders", Authenticate, GetCurrentOrders);
router.put("/order/:id/process", Authenticate, ProcessOrder);
router.get("/order/:id", Authenticate, GetOrderDetails);

//---------- Offers
router.get("/offers", Authenticate, GetOffers);
router.post("/offer", Authenticate, AddOffer);
router.put("/offer/:id", Authenticate, EditOffer);

export { router as VendorRoute };
