const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "La atracción debe tener nombre"],
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Debes indicar la calificación de la atracción"],
  },
  description: {
    type: String,
    required: [true, "La atracción debe tener descripción"],
  },
  waitTime: {
    type: Number,
    default: 0,
  },
  thrillLevel: {
    type: String,
    default: "Moderada",
  },
  minHeight: {
    type: String,
    default: "Sin restricción",
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, "Debes indicar la latitud"],
    },
    lng: {
      type: Number,
      required: [true, "Debes indicar la longitud"],
    },
  },
  park: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Park",
    required: true,
  },
  photos: [
    {
      type: String,
    },
  ],
});

attractionSchema.pre(/^find/, function () {
  this.populate({ path: "park" });
});

const Attraction = mongoose.model("Attraction", attractionSchema);
module.exports = Attraction;
