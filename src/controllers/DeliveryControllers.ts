import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import { AuthPayLoad } from "../dto";
import {
  CreateDeliveryUserInputs,
  CustomerLoginInput,
  EditCustomerProfileInputs,
} from "../dto/Customer.dto";
import { Customer, Delivery, DeliveryDoc, Food, Vendor } from "../models";
import { GenerateOTP } from "../util/Notification";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../util/PasswordUtility";

export const DeliverySignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryInput = plainToClass(CreateDeliveryUserInputs, req.body); //convert req.body to CustomerInput class
  const inputErrors = await validate(CreateDeliveryUserInputs);
  if (inputErrors.length > 0) {
    res.status(400).json(inputErrors);
    return;
  }

  const { email, password, phone, address, firstName, lastName, pinCode } =
    deliveryInput;
  //check if customer with email OR phone already exists?
  const existingDelivery = await Delivery.findOne({ email });

  if (existingDelivery) {
    res.status(409).json({ message: "Delivery already exists" });
    return;
  }

  //generate salt and hash password
  const salt = await GenerateSalt();
  const hashedPassword = await GeneratePassword(password, salt);

  const createdDelivery: DeliveryDoc = await Delivery.create({
    email,
    password: hashedPassword,
    phone,
    salt,
    firstName,
    lastName,
    address,
    verified: false,
    lat: 0,
    lng: 0,
  });
  if (createdDelivery) {
    //await OnRequestOTP(otp, "1234");
    const payload: AuthPayLoad = {
      _id: createdDelivery._id as string,
      email: createdDelivery.email,
      verified: createdDelivery.verified,
    };

    const signature = GenerateSignature(payload);
    res.status(200).json({ message: "Successfully created", signature });
    return;
  }
};

export const DeliverySignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //login input
  const loginInput = plainToClass(CustomerLoginInput, req.body);
  //check for errors
  const inputErrors = await validate(loginInput, {
    validationError: { target: true, value: false },
  });
  if (inputErrors.length > 0) {
    res.status(404).json(inputErrors);
    return;
  }
  //Deconstruct the input
  const { email, password } = loginInput;
  //Find the customer using the the email
  const customer = await Customer.findOne({ email });
  if (!customer) {
    res.status(400).json({ message: "Customer is not found" });
    return;
  }

  //Validate the deconstruct input with the password in the database
  if (ValidatePassword(password, customer.password)) {
    customer.verified = true;
    await customer.save();

    const payload: AuthPayLoad = {
      _id: customer._id as string,
      email,
      verified: customer.verified,
    };

    const signature = GenerateSignature(payload);

    res.status(200).json({
      message: "Login success",
      signature,
      email: customer.email,
      verified: customer.verified,
    });
    return;
  }

  res.json(400).json({
    message: "Login failed. Please try again later",
  });
  //return the signature of the updated customer
};

export const GetDeliveryProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const customer = await Customer.findOne({ _id: user._id });
  if (customer) {
    res.status(200).json({
      customer,
    });
    return;
  }
  res.status(400).json({ message: "Cannot find customer profile" });
  return;
};

export const EditDeliveryProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

  const profileErrors = await validate(profileInputs, {
    validationError: { target: true, value: false },
  });

  const targetError = profileErrors.map((error) => {
    const description = `Errors on part`;
    return `${description}[${error}]`;
  });

  if (profileErrors.length > 0) {
    res.status(400).json({ message: "Invalid input", targetError });
    return;
  }

  //Deconstruct the inputs
  const { firstName, lastName, address } = profileInputs;
  if (customer) {
    const profile = await Customer.findOne({ _id: customer._id });

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const updatedProfile = await profile.save();

      res.status(200).json({
        message: "Customer profile updated successfully",
        updatedProfile,
      });

      return;
    }

    res.status(400).json({ message: "Cannot find customer profile" });
    return;
  }

  res.status(400).json({ message: "Something went wrong" });
  return;
};

export const UpdateDeliveryStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

//--------------------- Delivery notification -----------------------

//--------------------- Order section -----------------------------
