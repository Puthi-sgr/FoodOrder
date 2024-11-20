import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { FindVendor } from "./AdminControllers";
import { GeneratePassword, GenerateSignature, ValidatePassword } from "../util";
import { Vendor } from "../models/Vendor";

//#region Vendor
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
        _id: existingVendor._id as string,
        email: existingVendor.email,
        name: existingVendor.name,
        foodTypes: existingVendor.foodType,
      });
      res.json({ message: signature });
      return;
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
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);

    res.json(existingVendor);
    return;
  }
  res.json({ message: "Fail to fetch user's profile" });
  return;
};

const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodType } = <EditVendorInput>req.body;

  const user = req.user;

  if (user) {
    //fetch user in Database using req.user
    const vendor = await Vendor.findOne({ _id: user._id });
    if (vendor) {
      vendor.name = name;
      vendor.address = address;
      vendor.phone = phone;
      vendor.foodType = foodType;

      const saveResult = await vendor.save();

      res.json(saveResult);
      return;
    } else {
      res.json({ message: "Vendor is not found" });
      return;
    }
  }

  res.json({ message: "User is not found" });
  return;
};

const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    //fetch user in Database using req.user
    const vendor = await Vendor.findOne({ _id: user._id });
    if (vendor) {
      vendor.serviceAwaitable = !vendor.serviceAwaitable;
      const saveResult = await vendor.save();

      res.json(saveResult);
      return;
    } else {
      res.json({ message: "Vendor is not found" });
      return;
    }
  }

  res.json({ message: "User is not found" });
  return;
};

//#endregion

//#region FoodRegion

const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
  return;
};

const AddFood = async (req: Request, res: Response, next: NextFunction) => {
  return;
};

//#endregion
export {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorService,
  UpdateVendorProfile,
  GetFoods,
  AddFood,
};
