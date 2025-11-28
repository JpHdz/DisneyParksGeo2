const multer = require("multer");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const fs = require("fs");

// Configuración básica de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir); // Carpeta local para imágenes
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Solo se permiten imágenes", 400), false);
  }
};

const upload = multer({ storage, fileFilter });

// Factory para subir, editar y eliminar imágenes en cualquier modelo
// Factory para subir, editar y eliminar imágenes en cualquier modelo
exports.uploadPhoto = (Model) => [
  upload.single("photo"),
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("No se encontró el documento", 404));
    
    if (req.file) {
      doc.photo = req.file.path;
      await doc.save();
    }

    res.status(200).json({
      status: "success",
      data: { photo: doc.photo },
    });
  }),
];

exports.deletePhoto = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("No se encontró el documento", 404));
    
    doc.photo = "default.jpg"; // O null, dependiendo de la lógica deseada
    await doc.save();

    res.status(200).json({
      status: "success",
      data: { photo: doc.photo },
    });
  });

exports.editPhotos = (Model) =>
  catchAsync(async (req, res, next) => {
    // Esta función podría ser redundante si uploadPhoto maneja la actualización
    // Pero la mantenemos por compatibilidad de rutas si es necesario, 
    // aunque idealmente se debería usar uploadPhoto para todo cambio de imagen.
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("No se encontró el documento", 404));
    
    if (req.body.photo) {
        doc.photo = req.body.photo;
        await doc.save();
    }
    
    res.status(200).json({
      status: "success",
      data: { photo: doc.photo },
    });
  });
