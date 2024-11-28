import bcrypt from "bcrypt";
import { VendorPayLoad } from "../dto";
import jwt, { sign } from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthPayLoad } from "../dto/Auth.dto";
import { Request } from "express";
dotenv.config();

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const GenerateSignature = (payload: VendorPayLoad) => {
  return jwt.sign(payload, process.env.APP_SECRET as string, {
    expiresIn: "1d",
  });
};

export const ValidateSignature = async (req: Request) => {
  try {
    const signature = req.get("Authorization");

    if (signature) {
      const token = signature.split(" ")[1];

      const payload = (await jwt.verify(
        token,
        process.env.APP_SECRET as string
      )) as AuthPayLoad;

      req.user = payload;

      return true;
    }
  } catch (err: any) {
    console.log("Verification error: ", err.message);
    return false;
  }
};
