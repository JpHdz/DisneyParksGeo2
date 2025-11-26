const Restaurant = require("../models/restaurantModel");
const Dish = require("../models/dishModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllRestaurants = factory.getAll(Restaurant);
exports.getRestaurant = factory.getOne(Restaurant, "dishes");
exports.createRestaurant = factory.createOne(Restaurant);
exports.updateRestaurant = factory.updateOne(Restaurant);

exports.deleteRestaurant = factory.deleteOne(Restaurant);

// Crear platillo y asociarlo al restaurante
exports.createDishInRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return next(new AppError("No restaurant found with that ID", 404));
  }
  const dish = await Dish.create(req.body);
  restaurant.dishes.push(dish._id);
  await restaurant.save();
  res.status(201).json({
    status: "success",
    data: {
      restaurant,
      dish,
    },
  });
});
