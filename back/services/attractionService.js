const Attraction = require("../models/attractionModel");
const factory = require("./handlerFactory");

exports.getAllAttractions = factory.getAll(Attraction);
exports.getAttraction = factory.getOne(Attraction);
exports.createAttraction = factory.createOne(Attraction);
exports.updateAttraction = factory.updateOne(Attraction);
exports.deleteAttraction = factory.deleteOne(Attraction);
