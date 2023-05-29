// Importation du module permettant de vérifier l'authentification de l'utilisateur.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Récupération du token.
    const token = req.headers.authorization.split(" ")[1];
    // Vérification du token dans la base de donnée.
    const decodedToken = jwt.verify(token, `${process.env.JWT_KEY_TOKEN}`);
    // Récupération de l'userId.
    const userId = decodedToken.userId;
    // Ajout de l'userId à l'objet de requête.
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
