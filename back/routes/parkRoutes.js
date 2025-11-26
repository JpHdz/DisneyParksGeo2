const express = require("express");
const parkService = require("../services/parkService");
const router = express.Router();

router.route("/").get(parkService.getAllParks).post(parkService.createPark);

router
  .route("/:id")
  .get(parkService.getPark)
  .patch(parkService.updatePark)
  .delete(parkService.deletePark);

module.exports = router;
