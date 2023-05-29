// Importation du module permettant d'interagir avec une base de données MongoDB.
const mongoose = require("mongoose");

// Définissions de la structure/propriétés du schéma à stocker dans la base de données.
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0, required: true },
  dislikes: { type: Number, default: 0, required: true },
  usersLiked: { type: Array, default: [], required: true },
  usersDisliked: { type: Array, default: [], required: true },
});

// Exportation du module.
module.exports = mongoose.model("Sauce", sauceSchema);
