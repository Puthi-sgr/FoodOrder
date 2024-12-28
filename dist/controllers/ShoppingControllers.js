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
exports.GetRestaurantById = exports.SearchFood = exports.GetFoodIn30Min = exports.GetFoodAvailability = exports.GetTopRestaurant = void 0;
const models_1 = require("../models");
const GetTopRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //search the pin code from the link
    const pinCode = req.params.pinCode;
    const result = yield models_1.Vendor.find({
        pinCode,
        serviceAvailability: true,
    }) //find the vendor geo area and choose those who are available
        .sort({ rating: -1 }); //sort the list in a descending order
    if (result.length > 0) {
        res.json({ result });
        return;
    }
    res.status(400).json({ message: "No restaurant was found" });
});
exports.GetTopRestaurant = GetTopRestaurant;
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //search the pin code from the link
    const pinCode = req.params.pinCode;
    const result = yield models_1.Vendor.find({
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
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetFoodIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pinCode = req.params.pinCode;
    const result = yield models_1.Vendor.find({
        pinCode,
        serviceAvailability: true,
    }) //find the vendor geo area and choose those who are available
        .sort({ rating: -1 }) //sort the list in a descending order
        .populate("foods"); //merge the food data
    if (result.length > 0) {
        let foodResult = []; //Place holder for the food  data
        //Loop through the vendors and only store the food props inside the foodResult
        result.map((vendor) => {
            const food = vendor.foods;
            foodResult.push(...food);
        });
        //Food result only store the availability time
        foodResult = foodResult.filter((food) => food.readyTime <= 60);
        res.json(foodResult);
        return;
    }
    res.status(400).json({ message: "No food was found" });
});
exports.GetFoodIn30Min = GetFoodIn30Min;
const SearchFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pinCode = req.params.pinCode;
    const result = yield models_1.Vendor.find({
        pinCode,
    }) //find the vendor geo area and choose those who are available
        .populate("foods"); //merge the food data
    if (result.length == 0) {
        res.json({ message: "No food was found" });
    }
    if (result.length > 0) {
        res.json(result);
        return;
    }
    res.status(400).json({ message: "Error while fetching for food" });
});
exports.SearchFood = SearchFood;
const GetRestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const vendor = yield models_1.Vendor.findById(id).populate("foods");
    if (!vendor) {
        res.status(400).json({ message: "Vendor was not found" });
        return;
    }
    res.json(vendor);
    return;
});
exports.GetRestaurantById = GetRestaurantById;
//# sourceMappingURL=ShoppingControllers.js.map