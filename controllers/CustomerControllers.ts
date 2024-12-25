import { CustomerDoc, Vendor } from "../models";
import { Request, Response, NextFunction, response } from "express";
import {
  CustomerInput,
  CustomerLoginInput,
  EditCustomerProfileInputs,
} from "../dto/Customer.dto";
import { Customer } from "../models";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import {
  GenerateSalt,
  GeneratePassword,
  GenerateSignature,
  ValidatePassword,
} from "../util/PasswordUtility";
import { GenerateOTP, OnRequestOTP } from "../util/Notification";
import { AuthPayLoad } from "../dto";
import { sign } from "jsonwebtoken";
import { CustomerRoute } from "../routes";
import { CustomerProfilesEntityAssignmentsContextImpl } from "twilio/lib/rest/trusthub/v1/customerProfiles/customerProfilesEntityAssignments";

export const SignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInput = plainToClass(CustomerInput, req.body); //convert req.body to CustomerInput class
  const inputErrors = await validate(customerInput);
  if (inputErrors.length > 0) {
    res.status(400).json(inputErrors);
    return;
  }

  const { email, password, phone } = customerInput;
  //check if customer with email OR phone already exists?
  const existingCustomer = await Customer.findOne({ email });

  if (existingCustomer) {
    res.status(400).json({ message: "Customer already exists" });
    return;
  }

  //generate salt and hash password
  const salt = await GenerateSalt();
  const hashedPassword = await GeneratePassword(password, salt);
  const { otp, expiry } = GenerateOTP();
  console.log(otp);
  const createdCustomer: CustomerDoc = await Customer.create({
    email,
    password: hashedPassword,
    phone,
    salt,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    otp,
    otp_expiry: expiry,
    lat: "",
    lng: "",
  });
  if (createdCustomer) {
    //await OnRequestOTP(otp, "1234");
    const payload: AuthPayLoad = {
      _id: createdCustomer._id as string,
      email: createdCustomer.email,
      verified: createdCustomer.verified,
    };

    const signature = GenerateSignature(payload);
    res.status(200).json({ message: "OTP sent successfully", signature });
    return;
  }
};

export const SignIn = async (
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
export const Verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const user = req.user;
  const customer = await Customer.findOne({ _id: user._id });

  if (!customer) {
    res.status(400).json({ message: "Customer was not found" });
    return;
  }

  if (customer.verified) {
    res.status(200).json({ message: "OTP has been verified" });
    return;
  }
  //checks if the otp is matched and hasn't expired yet
  if (customer.otp.toString() === otp && new Date() <= customer.otp_expiry) {
    customer.verified = true;
    customer.otp = undefined;
    customer.otp_expiry = undefined;

    await customer.save();

    console.log("Customer verified field is flipped to true");

    const payload: AuthPayLoad = {
      _id: customer._id as string,
      email: customer.email,
      verified: customer.verified,
    }; //payload with true verification

    const signature = GenerateSignature(payload);

    res.json({ message: "Account verification complete", signature });
    return;
  }

  res.status(400).json({ message: "Something went wrong" });
  return;
};

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Send OTP is available unless the user is sign in
  //Use the signature to deconstruct the _id and find the customer
  const user = req.user;

  const customer = await Customer.findOne({ _id: user._id });

  if (!customer) {
    res.status(400).json({ message: "Invalid signature" });
    return;
  }

  //Update the customer with  new OPT and expiry
  const { otp, expiry } = GenerateOTP();
  customer.otp = otp;
  customer.otp_expiry = expiry;
  customer.verified = false;
  await customer.save();

  //send the OPT to user
  // await OnRequestOTP(otp, "+855593363");
  res.status(200).json({ message: "OTP has been successfully sent", otp });

  //resend to otp to the customer
  //update the otp expiry
  //return the otp code
};

export const GetCustomerProfile = async (
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

export const EditCustomerProfile = async (
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
