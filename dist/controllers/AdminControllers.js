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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindVendor = exports.GetVendorById = exports.GetVendor = exports.CreateVendor = void 0;
const Vendor_1 = require("../models/Vendor");
const util_1 = require("../util");
const mongoose_1 = __importDefault(require("mongoose"));
const FindVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        const vendor = yield Vendor_1.Vendor.findOne({ email: email });
        return vendor;
    }
    else {
        const vendor = yield Vendor_1.Vendor.findOne({ _id: id });
        return vendor;
    }
});
exports.FindVendor = FindVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pinCode, foodType, email, password, ownerName, phone, } = req.body;
    try {
        const Taken = yield FindVendor(" ", email);
        if (Taken) {
            res.status(400).json({ message: "Email is taken" });
            return;
        }
        const salt = yield (0, util_1.GenerateSalt)();
        const hashPassword = yield (0, util_1.GeneratePassword)(password, salt);
        const CreateNewVendor = yield Vendor_1.Vendor.create({
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
        });
        res.status(201).json({ CreateNewVendor });
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
});
exports.CreateVendor = CreateVendor;
const GetVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield Vendor_1.Vendor.find();
    //error handling
    if (!vendors) {
        res.status(400).json({ message: "error fetching vendors" });
        return;
    }
    res.status(200).json({ vendors });
    return;
});
exports.GetVendor = GetVendor;
const GetVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({
            message: "Invalid id format",
        });
        return;
    }
    const id = req.params.id;
    const vendor = yield FindVendor(id);
    if (!vendor) {
        res.status(400).json({
            message: "Vendor does not exist",
        });
        return;
    }
    res.status(200).json({ vendor });
    return;
});
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminControllers.js.map