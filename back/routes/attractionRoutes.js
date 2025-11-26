const express = require("express");
const attractionService = require("../services/attractionService");
const router = express.Router();

router
  .route("/")
  .get(attractionService.getAllAttractions)
  .post(attractionService.createAttraction);

router
  .route("/:id")
  .get(attractionService.getAttraction)
  .patch(attractionService.updateAttraction)
  .delete(attractionService.deleteAttraction);

module.exports = router;
