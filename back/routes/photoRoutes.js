const express = require("express");
const photoFactory = require("../services/photoFactory");
const Park = require("../models/parkModel");
const Attraction = require("../models/attractionModel");
const Restaurant = require("../models/restaurantModel");
const router = express.Router();

// Subir fotos
router.post("/parks/:id/photos", photoFactory.uploadPhoto(Park));
router.post("/attractions/:id/photos", photoFactory.uploadPhoto(Attraction));
router.post("/restaurants/:id/photos", photoFactory.uploadPhoto(Restaurant));

// Editar fotos
router.patch("/parks/:id/photos", photoFactory.editPhotos(Park));
router.patch("/attractions/:id/photos", photoFactory.editPhotos(Attraction));
router.patch("/restaurants/:id/photos", photoFactory.editPhotos(Restaurant));

// Eliminar foto específica
router.delete("/parks/:id/photos", photoFactory.deletePhoto(Park));
router.delete("/attractions/:id/photos", photoFactory.deletePhoto(Attraction));
router.delete("/restaurants/:id/photos", photoFactory.deletePhoto(Restaurant));

module.exports = router;
