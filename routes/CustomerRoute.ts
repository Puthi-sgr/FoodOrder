import express from "express";
import { SignUp, SignIn, Verify, sendOtp } from "../controllers";
import { Authenticate } from "../middlewares/CommonAuth";

const router = express.Router();

router.post("/signup", SignUp);

router.post("/signin", SignIn);

router.post("/verify", Authenticate, Verify);

router.get("/otp", Authenticate, sendOtp);

//---------- Cart ----------

//---------- Order ----------

//---------- Payment ----------

export { router as CustomerRoute };
