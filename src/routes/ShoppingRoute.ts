import express from "express";
import {
  GetFoodIn30Min,
  GetRestaurantById,
  GetFoodAvailability,
  GetTopRestaurant,
  SearchFood,
  GetOffers,
} from "../controllers/index";

const router = express.Router();

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

//** ------------------- Find Offers ----------------------- */
router.get("offers/:pinCode", GetOffers);
/* ----------------------------- 
Find restaurant by id ----------------------------- */
router.get("/restaurant/:id", GetRestaurantById);

router.post("/");

export { router as ShoppingRoute };
