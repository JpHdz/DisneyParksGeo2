const multer = require("multer");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Configuración básica de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta local para imágenes
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
exports.uploadPhoto = (Model) => [
  upload.array("photos", 5),
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("No se encontró el documento", 404));
    const photoPaths = req.files.map((file) => file.path);
    doc.photos = doc.photos.concat(photoPaths);
    await doc.save();
    res.status(200).json({
      status: "success",
      data: { photos: doc.photos },
    });
  }),
];

exports.deletePhoto = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("No se encontró el documento", 404));
    const { photo } = req.body;
    doc.photos = doc.photos.filter((p) => p !== photo);
    await doc.save();
    res.status(200).json({
      status: "success",
      data: { photos: doc.photos },
    });
  });

exports.editPhotos = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError("No se encontró el documento", 404));
    doc.photos = req.body.photos;
    await doc.save();
    res.status(200).json({
      status: "success",
      data: { photos: doc.photos },
    });
  });
