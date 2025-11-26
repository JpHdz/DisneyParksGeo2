const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El platillo debe tener nombre"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "El platillo debe tener descripción"],
  },
});

const Dish = mongoose.model("Dish", dishSchema);
module.exports = Dish;
