import { Request, Response, NextFunction } from "express";
import { CreateFoodInput, EditVendorInput, VendorLoginInput } from "../dto";
import { FindVendor } from "./AdminControllers";
import { GeneratePassword, GenerateSignature, ValidatePassword } from "../util";
import { Vendor, VendorDoc } from "../models/Vendor";
import { Food } from "../models";

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

  //handler user not found
  if (!user) {
    res.json({ message: "Fail to fetch user's profile" });
    return;
  }

  const existingVendor = await FindVendor(user._id);

  if (!existingVendor) {
    res.json({
      message: "Vendor is not found",
    });
    return;
  }

  res.json(existingVendor);
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

const UpdateCoverImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    //fetch user in Database using req.user
    try {
      const vendor = await Vendor.findOne({ _id: user._id });

      if (!vendor) {
        res.json({ message: "Vendor is not found" });
        return;
      }
      //store the file
      const files = req?.files as [Express.Multer.File];
      //map all file into this array
      const CoverImages = files.map(
        (file: Express.Multer.File) => file.filename
      );

      vendor.coverImages.push(...CoverImages);

      const result = await vendor.save();

      res.json({ message: "Cover image updated successfully", result });
      return;
    } catch (err: any) {
      console.log("Error message: ", err.message);
      res.status(500);
      return;
    }
  }
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
      vendor.serviceAvailability = !vendor.serviceAvailability;
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
  const user = req.user;

  if (!user) {
    res.status(400).json({ message: "Unauthorized access" });
  }

  const foods = await Food.find({ vendorId: user?._id });

  res.status(200).json({ foods });
  return;
};

const AddFood = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    res.status(400).json({ message: "Unauthorized access" });
  }

  try {
    if (user) {
      const { name, description, category, foodType, readyTime, price } = <
        CreateFoodInput
      >req.body;

      const vendor = (await FindVendor(user._id)) as any;
      if (vendor) {
        const files = req.files as [Express.Multer.File];

        const images = files.map(
          (image: Express.Multer.File) => image.filename
        );

        const createdFood = await Food.create({
          vendorId: vendor._id,
          name,
          description,
          category,
          foodType,
          readyTime,
          price,
          images,
          rating: 0,
        });

        vendor?.foods.push(createdFood);
        const result = await vendor.save();

        res.json(result);
        return;
      }
    }
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
    return;
  }

  res.status(400).json({ message: "Failed to add food" });
  return;
};

//#endregion
export {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorService,
  UpdateVendorProfile,
  UpdateCoverImages,
  GetFoods,
  AddFood,
};
