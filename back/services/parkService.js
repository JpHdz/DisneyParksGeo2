const Park = require("../models/parkModel");
const factory = require("./handlerFactory");

exports.getAllParks = factory.getAll(Park);
exports.getPark = factory.getOne(Park);
exports.createPark = factory.createOne(Park);
exports.updatePark = factory.updateOne(Park);
exports.deletePark = factory.deleteOne(Park);
