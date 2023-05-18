// Importation des différents modules.
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Déclaration du modele user.
const User = require("../models/User");

// Fonction d'inscription sur via "signup".
exports.signup = (req, res, next) => {
  console.log("signup");
  // Utilisation de "bcrypt" pour hasher le pwd ->
  // 10 fois pour la sécurité et éviter un trop grand ralentissement.
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Création d'un nouveau User dans la base de donnée.
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Enregistrement du nouvel User dans la base de donnée.
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction de connexion via "login".
exports.login = (req, res, next) => {
  // Récupération de l'User via "findOne".
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // Si il y a une erreur un message indique que l'une des deux informations données ->
        // email ou pwd est incorrecte (sans préciser laquelle pour une meilleure sécurité).
        return res.status(401).json({ error: "Paire identifiant/mot de passe incorrecte !" });
      }
      // Comparaison du pwd hasher avec celui de la base de donnée via "compare".
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Paire identifiant/mot de passe incorrecte !" });
          }
          // Si le pwd est valide -> on retourne l'id avec "jwt.sign".
          res.status(200).json({
            userId: user._id, // Payload
            token: jwt.sign(
              { userId: user._id },
              `${process.env.JWT_KEY_TOKEN}`, // Token JWT.
              {
                expiresIn: "24h", // Délais de validité du token.
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
