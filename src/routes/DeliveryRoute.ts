import express from "express";
import {
  SignUp,
  SignIn,
  DeliverySignIn,
  DeliverySignUp,
  GetDeliveryProfile,
  EditDeliveryProfile,
  UpdateDeliveryStatus,
} from "../controllers";
import { Authenticate } from "../middlewares/CommonAuth";

const router = express.Router();

router.post("/signup", DeliverySignUp);

router.post("/signin", DeliverySignIn);

router.put("/change-status", UpdateDeliveryStatus);

router.get("/profile", GetDeliveryProfile);

router.patch("/profile", EditDeliveryProfile);

export { router as DeliveryRoute };
