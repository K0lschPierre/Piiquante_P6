// Importation du module de validation de chaîne.
const validator = require("validator");

module.exports = (req, res, next) => {
  // Extraction de l'email du corps de la requête HTTP.
  var email = req.body.email;
  console.log("->EMAIL VALIDATOR");
  console.log(email);
  // Vérification de la validité de l'email via "isEmail".
  if (validator.isEmail(email)) {
    console.log(validator.isEmail(email));
    console.log(`L'email ${email} est valide`);
    next();
  } else {
    // Sinon, on renvoi un message d'erreur.
    res.status(400).json({ message: `L'email ${email} n'est pas valide` });
  }
};
