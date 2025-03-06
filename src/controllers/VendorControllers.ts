import { Request, Response, NextFunction } from "express";
import { constants } from "../Constants";
import {
  CreateFoodInput,
  CreateOfferInput,
  EditVendorInput,
  VendorLoginInput,
} from "../dto";
import { FindVendor } from "./AdminControllers";
import { GeneratePassword, GenerateSignature, ValidatePassword } from "../util";
import { Vendor, VendorDoc } from "../models/Vendor";
import { Food } from "../models/index";
import { Order } from "../models/index";
import { Offer } from "../models/Offer";
import { SigningRequestConfigurationListInstance } from "twilio/lib/rest/numbers/v1/signingRequestConfiguration";

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
      if (!files) {
        res.json({ message: "There are no image files" });
        return;
      }
      //map all file into this array
      const CoverImages = files?.map(
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

  const { lat, lng } = req.body;
  if (user) {
    //fetch user in Database using req.user
    const vendor = await Vendor.findOne({ _id: user._id });
    if (vendor) {
      vendor.serviceAvailability = !vendor.serviceAvailability;

      //To find the nearest delivery boy
      if (lat && lng) {
        vendor.lat = lat;
        vendor.lng = lng;
      }

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

export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //grab the user <vendor>
  const user = req.user;

  if (!user) {
    res.json({ message: "Unauthorized" });
    return;
  }

  //if they exists do this
  //Find the order of vendor id , populate the items food
  const orders = await Order.findOne({ vendorID: user._id }).populate(
    "items.food"
  );
  console.log(orders);
  if (orders) {
    res.json({ message: "Success", orders });
    return;
  }

  res.status(400).json({ message: "Something went wrong" });
  return;
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get id
  const orderId = req.params.id;
  //get status. remarks,time
  const { orderStatus, remarks, time } = req.body;

  //if order id not exist, fall back
  if (!orderId) {
    res.json({ message: "Unable to process order" });
  }

  //find order through order id and populate food
  const order = await Order.findById(orderId).populate("food");
  //assign remarks and status to the order in the database
  order.remarks = remarks;
  order.orderStatus = orderStatus;
  if (time) {
    order.readyTime = time;
  }

  const orderResult = await order.save();
  res.json({ message: "Success", orderResult });
  return;
};

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderID = req.params.id;
  //if they exists do this
  //Find the order of vendor id , populate the items food
  const order = (await Order.findById(orderID)).populated("items.food");
  if (order) {
    res.json({ message: "Success", order });
    return;
  }

  res.json({ message: "Something went wrong" });
  return;
};

export const GetOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(constants.UNAUTHORIZED).json({ message: "Not authorized" });
      return;
    }

    const offers = await Offer.find().populate("vendors");

    let currentOffers = Array();

    offers.map((offer) => {
      if (offer.vendors) {
        offer.vendors.map((vendor) => {
          if (vendor._id.toString() === user._id) {
            currentOffers.push(offer);
          }
        });
      }

      if (offer.offerType === "GENERIC") {
        currentOffers.push(offer);
      }
    });

    res.status(200).json({ message: "Success", currentOffers });
    return;
  } catch (error) {
    res.status(constants.SERVER_ERROR).json({ error });
    return;
  }
};

export const AddOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      res.json({ message: "Not authorized" });
      return;
    }

    const {
      title,
      description,
      offerType,
      offerAmount,
      pinCode,
      promoCode,
      promoType,
      startValidity,
      endValidity,
      bank,
      bins,
      minValue,
      isActive,
    } = <CreateOfferInput>req.body;

    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
      res.json({ message: "Vendor not found" });
      return;
    }

    const offer = await Offer.create({
      title,
      description,
      offerType,
      offerAmount,
      pinCode,
      promoCode,
      promoType,
      startValidity,
      endValidity,
      bank,
      bins,
      minValue,
      isActive,
      vendors: [vendor],
    });

    if (!offer) {
      res.json({ message: "Offer was not created" });
      return;
    }

    res.json({ message: "Offer was created successfully", offer });
    return;
  } catch (error) {
    res.json({ message: "Error occur", error });
    return;
  }
};

export const EditOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const {
      title,
      description,
      offerType,
      offerAmount,
      pinCode,
      promoCode,
      promoType,
      startValidity,
      endValidity,
      bank,
      bins,
      minValue,
      isActive,
    } = <CreateOfferInput>req.body;

    if (!user) {
      res.status(constants.UNAUTHORIZED).json({
        message: "Not authorized",
      });
      return;
    }
    const vendor = await Vendor.findById(user._id);

    if (!vendor) {
      res.status(constants.FORBIDDEN).json({
        message: "Vendor was not found",
      });
      return;
    }

    const offerId = req.params.id;

    const currentOffer = await Offer.findById(offerId);

    if (!currentOffer) {
      res.status(constants.FORBIDDEN).json({
        message: "Offer was not found",
      });
      return;
    }

    currentOffer.title = title;
    currentOffer.description = description;
    currentOffer.offerType = offerType;
    currentOffer.offerAmount = offerAmount;
    currentOffer.pinCode = pinCode;
    currentOffer.promoCode = promoCode;
    currentOffer.promoType = promoType;
    currentOffer.startValidity = startValidity;
    currentOffer.endValidity = endValidity;
    currentOffer.bank = bank;
    currentOffer.bins = bins;
    currentOffer.minValue = minValue;
    currentOffer.isActive = isActive;

    const updatedOffer = await currentOffer.save();

    res
      .status(200)
      .json({ message: "Offer updated successfully", updatedOffer });
    return;
  } catch (error) {
    res.status(constants.SERVER_ERROR).json(error);
    return;
  }
};

export {
  VendorLogin,
  GetVendorProfile,
  UpdateVendorService,
  UpdateVendorProfile,
  UpdateCoverImages,
  GetFoods,
  AddFood,
};
