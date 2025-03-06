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
  AddToCart,
  DeleteCart,
  GetCart,
  CreatePayment,
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
router.post("/cart", Authenticate, AddToCart);

router.get("/cart", Authenticate, GetCart);
//--------- Profile ---------
router.get("/offer/verify/:id");

router.delete("/cart", Authenticate, DeleteCart);
//---------- Order ----------
router.post("/create", Authenticate, CreateOrder);

router.get("/orders", Authenticate, GetOrders);

router.get("/order:id", Authenticate, GetOrderById);
//---------- Payment ----------
router.post("/payment", Authenticate, CreatePayment);
export { router as CustomerRoute };
