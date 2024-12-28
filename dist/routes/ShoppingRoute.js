"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
/* -----------------------------
Shopping availability ----------------------------- */
router.get("/pinCode");
/* -----------------------------
Get food availability ----------------------------- */
router.get("/foods-availability/:pinCode", index_1.GetFoodAvailability);
/* -----------------------------
Top Restaurant ----------------------------- */
router.get("/top-restaurant/:pinCode", index_1.GetTopRestaurant);
/* -----------------------------
food available in 30 mins ----------------------------- */
router.get("/foods-in-30mins/:pinCode", index_1.GetFoodIn30Min);
/* -----------------------------
search food ----------------------------- */
router.get("/search/:pinCode", index_1.SearchFood);
/* -----------------------------
Find restaurant by id ----------------------------- */
router.get("/restaurant/:id", index_1.GetRestaurantById);
router.post("/");
//# sourceMappingURL=ShoppingRoute.js.map