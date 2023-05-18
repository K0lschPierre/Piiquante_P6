// Importation du module permettant la gestion des images.
const multer = require("multer");

// Création d'un dictionnaire.
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Stockage des images en local.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Stockage dans le dossier "images".
    callback(null, "images");
  },
  // Détermination du nom du fichier.
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    // Définition des extensions sur le dictionnaire.
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exportation du middleware avec l'appel de multer ->
// passage de l'objet storage via "single" pour spécifier qu'il s'agit d'un unique fichier.
module.exports = multer({ storage: storage }).single("image");
