import { Request, Response, NextFunction } from "express";
import { VendorLoginInput } from "../dto";
import { FindVendor } from "./AdminControllers";
import { GeneratePassword, GenerateSignature, ValidatePassword } from "../util";
import { ObjectId } from "mongoose";
const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = <VendorLoginInput>req.body;
  const existingVendor = await FindVendor("", email);

  if (existingVendor) {
    const validation = await ValidatePassword(
      password as string,
      existingVendor.password as string
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: existingVendor._id.toString(),
        email: existingVendor.email as string,
        name: existingVendor.name as string,
        foodTypes: existingVendor.foodType as string[],
      });
      res.json({ message: signature });
    } else {
      res.json({ message: "Login credential not valid" });
      return;
    }
  }

  res.json({ message: "Login credential not valid" });
  return;
};

const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const GetVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export { VendorLogin, GetVendorProfile, GetVendorService, UpdateVendorProfile };
