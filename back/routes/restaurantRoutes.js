const express = require("express");
const restaurantService = require("../services/restaurantService");
const router = express.Router();

router
  .route("/")
  .get(restaurantService.getAllRestaurants)
  .post(restaurantService.createRestaurant);

router
  .route("/:id")
  .get(restaurantService.getRestaurant)
  .patch(restaurantService.updateRestaurant)
  .delete(restaurantService.deleteRestaurant);

// Crear platillo en restaurante
router.post("/:id/dish", restaurantService.createDishInRestaurant);

module.exports = router;
