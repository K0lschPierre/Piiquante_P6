// Importation du module permettant de vérifier l'authentification de l'utilisateur.
const jwt = require("jsonwebtoken");
// Importation du module permettant de limiter le nombre de tentatives de connexion.
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limiter chaque IP à 10 requêtes par `window` (ici, par 15 minutes)
  standardHeaders: true, // Renvoie les informations de limite de débit dans les en-têtes `RateLimit-*`
});

module.exports = limiter;
