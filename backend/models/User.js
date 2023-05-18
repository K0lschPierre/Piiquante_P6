//  Importation du module permettant d'interagir avec une base de données MongoDB.
const mongoose = require("mongoose");
// Importation du module qui ajoute une validation de préenregistrement pour les champs uniques.
const uniqueValidator = require("mongoose-unique-validator");

// Modèle pour l'enregistrement d'un nouvel utilisateur.
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Plugin pour ne pas enregistrer la même adresse e-mail deux fois.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
