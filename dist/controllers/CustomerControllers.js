"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.sendOtp = exports.Verify = exports.SignIn = exports.SignUp = void 0;
const Customer_dto_1 = require("../dto/Customer.dto");
const models_1 = require("../models");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const PasswordUtility_1 = require("../util/PasswordUtility");
const Notification_1 = require("../util/Notification");
const SignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.CustomerInput, req.body); //convert req.body to CustomerInput class
    const inputErrors = yield (0, class_validator_1.validate)(customerInput);
    if (inputErrors.length > 0) {
        res.status(400).json(inputErrors);
        return;
    }
    const { email, password, phone } = customerInput;
    //check if customer with email OR phone already exists?
    const existingCustomer = yield models_1.Customer.findOne({ email });
    if (existingCustomer) {
        res.status(400).json({ message: "Customer already exists" });
        return;
    }
    //generate salt and hash password
    const salt = yield (0, PasswordUtility_1.GenerateSalt)();
    const hashedPassword = yield (0, PasswordUtility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, Notification_1.GenerateOTP)();
    console.log(otp);
    const createdCustomer = yield models_1.Customer.create({
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
        const payload = {
            _id: createdCustomer._id,
            email: createdCustomer.email,
            verified: createdCustomer.verified,
        };
        const signature = (0, PasswordUtility_1.GenerateSignature)(payload);
        res.status(200).json({ message: "OTP sent successfully", signature });
        return;
    }
});
exports.SignUp = SignUp;
const SignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //login input
    const loginInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.CustomerLoginInput, req.body);
    //check for errors
    const inputErrors = yield (0, class_validator_1.validate)(loginInput, {
        validationError: { target: true, value: false },
    });
    if (inputErrors.length > 0) {
        res.status(404).json(inputErrors);
        return;
    }
    //Deconstruct the input
    const { email, password } = loginInput;
    //Find the customer using the the email
    const customer = yield models_1.Customer.findOne({ email });
    if (!customer) {
        res.status(400).json({ message: "Customer is not found" });
        return;
    }
    //Validate the deconstruct input with the password in the database
    if ((0, PasswordUtility_1.ValidatePassword)(password, customer.password)) {
        customer.verified = true;
        yield customer.save();
        const payload = {
            _id: customer._id,
            email,
            verified: customer.verified,
        };
        const signature = (0, PasswordUtility_1.GenerateSignature)(payload);
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
});
exports.SignIn = SignIn;
const Verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const user = req.user;
    const customer = yield models_1.Customer.findOne({ _id: user._id });
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
        yield customer.save();
        console.log("Customer verified field is flipped to true");
        const payload = {
            _id: customer._id,
            email: customer.email,
            verified: customer.verified,
        }; //payload with true verification
        const signature = (0, PasswordUtility_1.GenerateSignature)(payload);
        res.json({ message: "Account verification complete", signature });
        return;
    }
    res.status(400).json({ message: "Something went wrong" });
    return;
});
exports.Verify = Verify;
const sendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Send OTP is available unless the user is sign in
    //Use the signature to deconstruct the _id and find the customer
    const user = req.user;
    const customer = yield models_1.Customer.findOne({ _id: user._id });
    if (!customer) {
        res.status(400).json({ message: "Invalid signature" });
        return;
    }
    //Update the customer with  new OPT and expiry
    const { otp, expiry } = (0, Notification_1.GenerateOTP)();
    customer.otp = otp;
    customer.otp_expiry = expiry;
    customer.verified = false;
    yield customer.save();
    //send the OPT to user
    // await OnRequestOTP(otp, "+855593363");
    res.status(200).json({ message: "OTP has been successfully sent", otp });
    //resend to otp to the customer
    //update the otp expiry
    //return the otp code
});
exports.sendOtp = sendOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const customer = yield models_1.Customer.findOne({ _id: user._id });
    if (customer) {
        res.status(200).json({
            customer,
        });
        return;
    }
    res.status(400).json({ message: "Cannot find customer profile" });
    return;
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, {
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
        const profile = yield models_1.Customer.findOne({ _id: customer._id });
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const updatedProfile = yield profile.save();
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
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerControllers.js.map