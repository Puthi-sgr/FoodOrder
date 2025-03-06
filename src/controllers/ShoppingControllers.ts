import express, { Response, Request, NextFunction } from "express";
import { FoodDoc, Vendor, VendorDoc } from "../models";
import { Offer } from "../models/Offer";

export const GetTopRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //search the pin code from the link
  const pinCode = req.params.pinCode;

  const result = await Vendor.find({
    pinCode,
    serviceAvailability: true,
  }) //find the vendor geo area and choose those who are available
    .sort({ rating: -1 }); //sort the list in a descending order

  if (result.length > 0) {
    res.json({ result });
    return;
  }

  res.status(400).json({ message: "No restaurant was found" });
};
export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //search the pin code from the link
  const pinCode = req.params.pinCode;

  const result = await Vendor.find({
    pinCode,
    serviceAvailability: true,
  }) //find the vendor geo area and choose those who are available
    .sort({ rating: -1 }) //sort the list in a descending order
    .populate("foods"); //merge the food data

  if (result.length > 0) {
    res.json({ result });
    return;
  }

  res.status(400).json({ message: "Result were not found" });
};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pinCode;

  const result = await Vendor.find({
    pinCode,
    serviceAvailability: true,
  }) //find the vendor geo area and choose those who are available
    .sort({ rating: -1 }) //sort the list in a descending order
    .populate("foods"); //merge the food data

  if (result.length > 0) {
    let foodResult: any[] = []; //Place holder for the food  data

    //Loop through the vendors and only store the food props inside the foodResult
    result.map((vendor: VendorDoc) => {
      const food = vendor.foods;

      foodResult.push(...food);
    });

    //Food result only store the availability time
    foodResult = foodResult.filter((food: FoodDoc) => food.readyTime <= 60);
    res.json(foodResult);

    return;
  }

  res.status(400).json({ message: "No food was found" });
};

export const SearchFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pinCode;

  const result = await Vendor.find({
    pinCode,
  }) //find the vendor geo area and choose those who are available
    .populate("foods"); //merge the food data

  const vendorList = result.map((res, key) => {
    const { name, address, foodType, phone, serviceAvailability, foods } = res;

    return {
      name,
      address,
      foodType,
      phone,
      serviceAvailability,
      foods,
    };
  });

  if (result.length == 0) {
    res.json({ message: "No food was found" });
  }

  if (result.length > 0) {
    res.json(vendorList);
    return;
  }

  res.status(400).json({ message: "Error while fetching for food" });
};

export const GetRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    const vendor = await Vendor.findById(id).populate("foods");

    if (!vendor) {
      res.status(400).json({ message: "Vendor was not found" });
      return;
    }

    res.json(vendor);
    return;
  } catch (err) {
    res.status(500).json({ err });
  }
};

export const GetAvailableOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pinCode = req.params.pinCode;

  const offers = await Offer.find({ pinCode: pinCode, isActive: true });

  try {
    if (!offers) {
      res.json(400).json({ message: "Offer was not found" });
      return;
    }

    res.json(200).json({ message: "Offer was found", offers });
  } catch (err) {
    res.json(500).json(err);
  }
};
