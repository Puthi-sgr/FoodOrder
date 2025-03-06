import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models/Vendor";
import { Transaction } from "../models/Transaction";
import { GeneratePassword, GenerateSalt } from "../util";
import mongoose from "mongoose";

const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    const vendor = await Vendor.findOne({ email: email });
    return vendor;
  } else {
    const vendor = await Vendor.findOne({ _id: id });
    return vendor;
  }
};
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

  try {
    const Taken = await FindVendor(" ", email);
    if (Taken) {
      res.status(400).json({ message: "Email is taken" });
      return;
    }
    const salt = await GenerateSalt();
    const hashPassword = await GeneratePassword(password, salt);

    const CreateNewVendor = await Vendor.create({
      name,
      address,
      pinCode,
      foodType,
      email,
      password: hashPassword,
      ownerName,
      phone,
      salt,
      serviceAvailability: true,
      coverImages: [],
      rating: 0,
      lat: 0,
      lng: 0,
    });
    res.status(201).json({ CreateNewVendor });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const GetVendor = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Fetching vendor");
  const vendors = await Vendor.find();
  console.log("Fetched vendor successfully");
  //error handling
  if (!vendors) {
    res.status(400).json({ message: "error fetching vendors" });
    return;
  }
  console.log("Reaching the response");
  res.status(200).json({ vendors });
  console.log("After the response");
  return;
};

const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      message: "Invalid id format",
    });
    return;
  }

  const id: string = req.params.id;
  const vendor = await FindVendor(id);

  if (!vendor) {
    res.status(400).json({
      message: "Vendor does not exist",
    });
    return;
  }
  res.status(200).json({ vendor });
  return;
};

const GetTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transactions = await Transaction.find();
  if (!transactions) {
    res.status(404).json({
      message: "No transactions are found",
    });
    return;
  }

  res.status(200).json({
    message: "Success",
    transactions,
  });
};
const GetTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const transaction = await Transaction.findById(id);
  if (!transaction) {
    res.status(404).json({
      message: "No transactions are found",
    });
    return;
  }

  res.status(200).json({
    message: "Success",
    transaction,
  });
};
export {
  CreateVendor,
  GetVendor,
  GetVendorById,
  FindVendor,
  GetTransactionById,
  GetTransactions,
};
