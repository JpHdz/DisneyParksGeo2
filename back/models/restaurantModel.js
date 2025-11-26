const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El restaurante debe tener nombre"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "El restaurante debe tener descripción"],
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Debes indicar el número de estrellas"],
  },
  category: {
    type: String,
    required: [true, "Debes indicar la categoría del restaurante"],
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
  dishes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
    },
  ],
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

restaurantSchema.pre(/^find/, function (next) {
  this.populate({ path: "dishes" }).populate({ path: "park" });
  next();
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
