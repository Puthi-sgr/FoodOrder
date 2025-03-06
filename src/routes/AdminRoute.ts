import express, { Request, Response, NextFunction } from "express";
import {
  CreateVendor,
  GetTransactionById,
  GetTransactions,
  GetVendor,
  GetVendorById,
  UpdateVendorProfile,
} from "../controllers/index";

const router = express.Router();

router.post("/vendor", CreateVendor);
router.get("/test", (req, res, next) => {
  res.json({
    message: "success test 4",
  });
  return;
});

router.get("/vendors", GetVendor);
router.get("/vendor/:id", GetVendorById);

router.get("/transactions", GetTransactions);
router.get("/transaction/:id", GetTransactionById);

export { router as AdminRoute };
