import express from "express";
import {
  SignUp,
  SignIn,
  Verify,
  sendOtp,
  EditCustomerProfile,
  GetCustomerProfile,
  CreateOrder,
  GetOrderById,
  GetOrders,
} from "../controllers";
import { Authenticate } from "../middlewares/CommonAuth";

const router = express.Router();

router.post("/signup", SignUp);

router.post("/signin", SignIn);

//--------- Authenticate ---------------

router.post("/verify", Authenticate, Verify);

router.get("/otp", Authenticate, sendOtp);

router.get("/profile", Authenticate, GetCustomerProfile);

router.patch("/edit", Authenticate, EditCustomerProfile);
//---------- Cart ----------

//---------- Order ----------
router.post("/create", Authenticate, CreateOrder);

router.get("/orders", Authenticate, GetOrders);

router.get("/order:id", Authenticate, GetOrderById);
//---------- Payment ----------

export { router as CustomerRoute };
