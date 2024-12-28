import express from "express";
import {
  GetFoodIn30Min,
  GetRestaurantById,
  GetFoodAvailability,
  GetTopRestaurant,
  SearchFood,
} from "../controllers/index";

const router = express.Router();

/* ----------------------------- 
Shopping availability ----------------------------- */
router.get("/pinCode");
/* ----------------------------- 
Get food availability ----------------------------- */
router.get("/foods-availability/:pinCode", GetFoodAvailability);
/* ----------------------------- 
Top Restaurant ----------------------------- */
router.get("/top-restaurant/:pinCode", GetTopRestaurant);
/* ----------------------------- 
food available in 30 mins ----------------------------- */

router.get("/foods-in-30mins/:pinCode", GetFoodIn30Min);

/* ----------------------------- 
search food ----------------------------- */
router.get("/search/:pinCode", SearchFood);
/* ----------------------------- 
Find restaurant by id ----------------------------- */
router.get("/restaurant/:id", GetRestaurantById);

router.post("/");

export { router as ShoppingRoute };
