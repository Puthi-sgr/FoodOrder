import { CustomerDoc, Food, Vendor } from "../models";
import { Request, Response, NextFunction, response } from "express";
import {
  CartItem,
  CustomerInput,
  CustomerLoginInput,
  EditCustomerProfileInputs,
  OrderInputs,
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

import { Order } from "../models/Order";
import { Offer } from "../models/Offer";
import { Transaction } from "../models/Transaction";
import { GetVendorById } from "./AdminControllers";

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
    order: [],
  });
  if (createdCustomer) {
    //await OnRequestOTP(otp, "1234");
    const payload: AuthPayLoad = {
      _id: createdCustomer._id as string,
      email: createdCustomer.email,
      verified: createdCustomer.verified,
    };

    const signature = GenerateSignature(payload);
    res.status(200).json({ message: "OTP sent successfully", signature, otp });
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

//-------------------------Cart-------------------------------
export const AddToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cartInput = plainToClass(CartItem, req?.body);
  //check for errors
  const inputErrors = await validate(cartInput, {
    validationError: { target: true, value: false },
  });
  if (inputErrors.length > 0) {
    res.status(404).json(inputErrors);
    return;
  }

  //get the customer
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    //have an array container
    let cartItems = Array();

    const { unit, _id } = cartInput;

    //deconstruct the object from the oder inputs
    const food = Food.findById(_id);
    if (profile) {
      cartItems = profile.cart;

      //if cart items have food
      if (cartItems.length > 0) {
        let existingFood = cartItems.filter(
          (item) => item._id.toString() === _id /*ID from request body*/
        ); //Choose the item that matches the request body, everything within the cart should be the same
        if (existingFood.length > 0) {
          const index = cartItems.indexOf(existingFood[0]); //Find the object that matches the existing food in the customer's cart
          if (unit > 0) {
            cartItems[index] = { food, unit }; //updating the unit and food of the specific object in the cart items array
          } else {
            cartItems.splice(index, 1); //removes the item from the array
          }
        } else {
          cartItems.push({ food, unit });
        }
      } else {
        cartItems.push({ food, unit });
      }

      if (cartItems) {
        profile.cart = cartItems as any;
        const cartResult = await profile.save();
        const data = cartResult.cart;
        res.json({ message: "Successfully added to cart", data });
        return;
      }
    }
  }

  res.json({ message: "Something went wrong" });
  return;
};

export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    res.json({ message: "Success", profile });
    return;
  }

  res.json({ message: "Failed to fetch customer's cart" });
  return;
};

export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (!customer) {
    res.json({ message: "Failed to fetch customer" });
    return;
  }

  const profile = await Customer.findById(customer._id).populate("cart.food");

  const cart = profile.cart;
  //if there are items in cart proceed to delete and if not return a message
  if (cart.length > 0) {
    profile.cart = [] as any;
    const emptyCartResult = await profile.save();
    res.json({
      message: "Successfully removed items from cart",
      emptyCartResult,
    });
    return;
  }

  res.json({ message: "Cart is already empty" });
  return;
};

//--------------------- Delivery notification -----------------------

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    return;
  }

  const areaCode = vendor.pinCode;
  const vendorLat = vendor.lat;
  const vendorLng = vendor.lng;

  //find the available delivery person
};

//--------------------- Order section -----------------------------
const validateTransaction = async (txnId: string) => {
  const currentTransaction = await Transaction.findById(txnId);

  try {
    if (!currentTransaction) return { status: false, currentTransaction };
    return currentTransaction?.status.toLowerCase() !== "failed"
      ? { status: true, currentTransaction }
      : { status: false, currentTransaction };
  } catch (error) {
    return { status: false, currentTransaction };
  }
};
export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const { txnId, amount, items } = <OrderInputs>req.body;

  if (customer) {
    //validate the transaction
    const { status, currentTransaction } = await validateTransaction(txnId);

    if (!status) {
      res.status(404).json({ message: "False transaction" });
    }

    const orderID = `${Math.floor(Math.random() * 9789) + 1000}`;
    //get  profile
    const profile = await Customer.findById(customer._id);

    let cart = <[CartItem]>items; //{id:xx, unit:xx}
    let cartItems = Array();
    let netAmount = 0.0;
    let vendorId;

    //let netAmount = 0;

    const foodItems = await Food.find().exec(); //execute the query to get food
    const cartItemIds = cart.map((item) => item._id); //create an array of items ids;
    const foods = foodItems.filter((food) => cartItemIds.includes(food.id)); //filter out the food that has the same id as card id

    console.log("Done processing the food: ", foods);
    try {
      foods.map((food) => {
        //maps over the cart
        //object as params, id unit
        cart.map(({ _id, unit }) => {
          //if carts food id is equal cart food if
          if (food._id === _id) {
            vendorId = food.vendorId;
            //Sum net amount with foodPrice times unit
            netAmount += unit * food.price;
            //push the food and unit
            cartItems.push({ food, unit });
          }
        });
      });

      //if the cart items exists, initialize the order
      if (cartItems) {
        const CreateOrder = await Order.create({
          orderID: orderID,
          vendorID: vendorId,
          customerID: profile._id,
          customerName: `${profile.firstName} ${profile.lastName}`,
          items: cartItems, //array
          totalAmount: netAmount,
          paidAmount: amount,
          orderDate: new Date(),
          paidThrough: "COD",
          paymentResponse: "",
          orderStatus: "Waiting",
          remarks: "",
          deliveryId: "",
          appliedOffer: false,
          offerId: null,
          readyTime: 45,
        });
        await CreateOrder.save();

        if (CreateOrder) {
          profile.cart = [] as any;
          profile.orders.push(CreateOrder);
          const profileResponse = await profile.save();

          //Update the transaction info
          currentTransaction.vendorId = vendorId;
          currentTransaction.orderId = orderID;
          currentTransaction.status = "CONFIRMED";

          await currentTransaction.save();

          assignOrderForDelivery(orderID, vendorId);

          res.json({ message: "Success", profileResponse });
          return;
          //Update the orders to user account
        }
      }
    } catch (err) {
      res.status(400).json({
        error: err.message,
        stackTrace: err.stackTrace,
      });
    }
  }

  res.json({ message: "Something went wrong" });
  return;
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //retrieve customer info
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");

    if (profile) {
      res.json({ message: "Success", profile });
      return;
    }
    res.json({ message: "Failed to fetch customer's profile" });
    return;
  }
  //map out customer .orders
  res.json({ message: "Failed to fetch customer's order" });
  return;
  //return the ordered list
};

export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderID = req.params.id;

  if (orderID) {
    const order = (await Order.findById(orderID)).populate("items.food");

    res.json({ message: "Success", order });
    return;
  }

  res.json({ message: "Failed to fetch order" });
  return;
};

export const VerifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offerId = req.params.id;
  const customer = req.user;

  try {
    if (!customer) {
      res.status(404).json({ message: "customer is not found" });
    }

    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer) {
      if (appliedOffer.promoType === "USER") {
      } else {
        return res
          .status(200)
          .json({ message: "Offer is valid", offer: appliedOffer });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch order" });
    return;
  }
};

//------------------- Payment section  -------------------------
export const CreatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const { amount, paymentMode, offerId } = req.body;
  const appliedOffer = await Offer.findById(offerId);

  let payableAmount = Number(amount);

  if (!appliedOffer || appliedOffer.isActive === false) {
    res.status(404).json({
      message: "Applied offer is not found",
    });
    return;
  }

  payableAmount = payableAmount - appliedOffer.offerAmount;

  //Create transaction record

  const transaction = await Transaction.create({
    customer: customer._id,
    vendorId: "",
    orderId: "",
    orderValue: payableAmount,
    offerUsed: offerId || "NA",
    status: "OPEN",
    paymentMode,
    paymentResponse: "Payment is Cash on Delivery",
  });

  res.status(200).json({ transaction });
  return;
};
