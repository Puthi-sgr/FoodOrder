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
exports.AddFood = exports.GetFoods = exports.UpdateCoverImages = exports.UpdateVendorProfile = exports.UpdateVendorService = exports.GetVendorProfile = exports.VendorLogin = void 0;
const AdminControllers_1 = require("./AdminControllers");
const util_1 = require("../util");
const Vendor_1 = require("../models/Vendor");
const models_1 = require("../models");
//#region Vendor
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminControllers_1.FindVendor)("", email);
    if (existingVendor) {
        const validation = yield (0, util_1.ValidatePassword)(password, existingVendor.password);
        if (validation) {
            const signature = (0, util_1.GenerateSignature)({
                _id: existingVendor._id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodTypes: existingVendor.foodType,
            });
            res.json({ message: signature });
            return;
        }
        else {
            res.json({ message: "Login credential not valid" });
            return;
        }
    }
    res.json({ message: "Login credential not valid" });
    return;
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    //handler user not found
    if (!user) {
        res.json({ message: "Fail to fetch user's profile" });
        return;
    }
    const existingVendor = yield (0, AdminControllers_1.FindVendor)(user._id);
    if (!existingVendor) {
        res.json({
            message: "Vendor is not found",
        });
        return;
    }
    res.json(existingVendor);
    return;
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, foodType } = req.body;
    const user = req.user;
    if (user) {
        //fetch user in Database using req.user
        const vendor = yield Vendor_1.Vendor.findOne({ _id: user._id });
        if (vendor) {
            vendor.name = name;
            vendor.address = address;
            vendor.phone = phone;
            vendor.foodType = foodType;
            const saveResult = yield vendor.save();
            res.json(saveResult);
            return;
        }
        else {
            res.json({ message: "Vendor is not found" });
            return;
        }
    }
    res.json({ message: "User is not found" });
    return;
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateCoverImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        //fetch user in Database using req.user
        try {
            const vendor = yield Vendor_1.Vendor.findOne({ _id: user._id });
            if (!vendor) {
                res.json({ message: "Vendor is not found" });
                return;
            }
            //store the file
            const files = req === null || req === void 0 ? void 0 : req.files;
            //map all file into this array
            const CoverImages = files.map((file) => file.filename);
            vendor.coverImages.push(...CoverImages);
            const result = yield vendor.save();
            res.json({ message: "Cover image updated successfully", result });
            return;
        }
        catch (err) {
            console.log("Error message: ", err.message);
            res.status(500);
            return;
        }
    }
});
exports.UpdateCoverImages = UpdateCoverImages;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        //fetch user in Database using req.user
        const vendor = yield Vendor_1.Vendor.findOne({ _id: user._id });
        if (vendor) {
            vendor.serviceAvailability = !vendor.serviceAvailability;
            const saveResult = yield vendor.save();
            res.json(saveResult);
            return;
        }
        else {
            res.json({ message: "Vendor is not found" });
            return;
        }
    }
    res.json({ message: "User is not found" });
    return;
});
exports.UpdateVendorService = UpdateVendorService;
//#endregion
//#region FoodRegion
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(400).json({ message: "Unauthorized access" });
    }
    const foods = yield models_1.Food.find({ vendorId: user === null || user === void 0 ? void 0 : user._id });
    res.status(200).json({ foods });
    return;
});
exports.GetFoods = GetFoods;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(400).json({ message: "Unauthorized access" });
    }
    try {
        if (user) {
            const { name, description, category, foodType, readyTime, price } = req.body;
            const vendor = (yield (0, AdminControllers_1.FindVendor)(user._id));
            if (vendor) {
                const files = req.files;
                const images = files.map((image) => image.filename);
                const createdFood = yield models_1.Food.create({
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
                vendor === null || vendor === void 0 ? void 0 : vendor.foods.push(createdFood);
                const result = yield vendor.save();
                res.json(result);
                return;
            }
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
        return;
    }
    res.status(400).json({ message: "Failed to add food" });
    return;
});
exports.AddFood = AddFood;
//# sourceMappingURL=VendorControllers.js.map