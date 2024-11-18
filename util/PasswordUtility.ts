import bcrypt from "bcrypt";
import { VendorPayLoad } from "../dto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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

export const ValidateSignature = async(payload: VendorPayLoad) => {
  return ;
}