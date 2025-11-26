const express = require("express");
const dishService = require("../services/dishService");
const router = express.Router();

router.route("/").get(dishService.getAllDishes).post(dishService.createDish);

router
  .route("/:id")
  .get(dishService.getDish)
  .patch(dishService.updateDish)
  .delete(dishService.deleteDish);

module.exports = router;
