// Importation du module.
const passwordValidator = require("password-validator");

// Création du schéma.
const passwordSchema = new passwordValidator();

// Ajout des propriétés au schéma du pwd.
passwordSchema
  .is()
  .min(8) // Longueur minimale 8.
  .is()
  .max(100) // Longueur maximale 100.
  .has()
  .uppercase(1) // Doit contenir des lettres majuscules.
  .has()
  .lowercase(1) // Doit contenir des lettres minuscules.
  .has()
  .digits(2) // Doit avoir au moins 2 chiffres.
  .has()
  .not()
  .spaces() // Ne doit pas avoir d'espaces.
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123", "Azerty", "Azerty123"]); // Blacklist.

// Vérification du pwd.
module.exports = (req, res, next) => {
  console.log("->PASSWORD VALIDATOR");
  if (passwordSchema.validate(req.body.password)) {
    console.log("pwd valid");
    console.log(passwordSchema.validate());
    console.log(passwordSchema.validate(req.body.password, { list: true }));
    next();
  } else {
    console.log(passwordSchema.validate());
    console.log(passwordSchema.validate(req.body.password, { list: true }));

    return res.status(400).json({
      message: `Mot de passe de sécurité faible, Try again ! ${passwordSchema.validate(
        req.body.password,
        {
          list: true,
        }
      )}`,
    });
  }
};
