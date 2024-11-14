import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models/Vendor";

const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pinCode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVendorInput>req.body;

  const CreateNewVendor = await Vendor.create({
    name,
    address,
    pinCode,
    foodType,
    email,
    password,
    ownerName,
    phone,
    salt: "",
    serviceAwaitable: false,
    coverImages: [],
    rating: 0,
  });
  res.status(400).json({ name });
};

const GetVendor = async (req: Request, res: Response, next: NextFunction) => {};

const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export { CreateVendor, GetVendor, GetVendorById };
