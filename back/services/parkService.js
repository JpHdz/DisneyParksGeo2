const Park = require("../models/parkModel");
const factory = require("./handlerFactory");

const Restaurant = require("../models/restaurantModel");
const Attraction = require("../models/attractionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllParks = factory.getAll(Park);
exports.getPark = factory.getOne(Park);
exports.createPark = factory.createOne(Park);
exports.updatePark = factory.updateOne(Park);

exports.deletePark = catchAsync(async (req, res, next) => {
  const park = await Park.findById(req.params.id);
  if (!park) {
    return next(new AppError("No se encontró el documento", 404));
  }

  const restaurants = await Restaurant.findOne({ park: req.params.id });
  if (restaurants) {
    return next(
      new AppError("No puedes eliminar un parque con restaurantes", 400)
    );
  }

  const attractions = await Attraction.findOne({ park: req.params.id });
  if (attractions) {
    return next(
      new AppError("No puedes eliminar un parque con atracciones", 400)
    );
  }

  await Park.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
