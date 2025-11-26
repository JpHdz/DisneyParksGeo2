const mongoose = require("mongoose");

const parkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El parque debe tener nombre"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "El parque debe tener descripción"],
  },
  polygon: {
    type: {
      type: String,
      enum: ["Polygon"],
      required: [true, "El polígono debe ser tipo Polygon"],
    },
    coordinates: {
      type: [[[Number]]], // Array de arrays de coordenadas [ [ [lng, lat], ... ] ]
      required: [true, "Debes indicar las coordenadas del polígono"],
    },
  },
  photos: [
    {
      type: String,
    },
  ],
});

const Park = mongoose.model("Park", parkSchema);
module.exports = Park;
