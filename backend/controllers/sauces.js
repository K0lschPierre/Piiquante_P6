// Importation des différents modules.
const Sauce = require("../models/Sauce");
const fs = require("fs");

// Création d'une sauce.
exports.createSauce = (req, res, next) => {
  // Parse de l'objet envoyé dans la requête.
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject);
  // Suppression de l'ID --> sera automatiquement généré par la base de données.
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    // Utilisation de l'userId du token d'authentification généré par le middleware.
    userId: req.auth.userId,
    // Génération de l'url de l'image.
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });

  // Enregistrement de l'objet qui vient d'être créer dans la base de données.
  sauce
    .save()
    .then(() => {
      // Statut 201 --> Objet crée.
      res.status(201).json({ message: "Sauce créée !" });
    })
    .catch((error) => {
      // Statut 400 --> Erreur.
      res.status(400).json({ error });
    });
};

// Suppression d'une sauce.
exports.deleteSauce = (req, res, next) => {
  // Récupération de l'objet à supprimer via "findOne".
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si l'id est différent de celui récupérer dans le token --> Erreur 400.
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé !" });
      } else {
        // Récupération de l'image dans l'objet -> extraction de l'URL avec "split".
        const filename = sauce.imageUrl.split("/images")[1];
        // Si, une image déjà présente -> suppression via le module "fs" avec "unlink".
        fs.unlink(`images/${filename}`, () => {
          // Suppression de la sauce avec "deletOne".
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Affichage d'une sauce.
exports.getOneSauce = (req, res, next) => {
  // Récupération de l'objet à sélectionner via "findOne" ->
  // passage en argument l'id de l'objet selectionné.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(201).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Modification d'une sauce.
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? // Récupération de l'objet en parsant la chaine de caractère ->
      // et récréant l'URL de l'image.
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : // Récupération de l'objet dans le corps de la requête ->
      // S'il n'y a pas de fichier transmis.
      {
        ...req.body,
      };

  // Suppression de l'userId ayant effectuer la requête ->
  // afin d'éviter qu'une personne ne créer un objet ->
  // puis le modifie pour le réassigner à une autre personne.
  delete sauceObject._userId;
  // Récupération de l'objet à selectionner via "findOne" ->
  // passage en argument l'id de l'objet selectionné.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Si l'id est différent de celui récupérer dans le token --> Erreur 400.
      if (sauce.userId != req.auth.userId) {
        return res.status(400).json({ message: "Non-autorisé" });
      } else {
        // Récupération de l'image dans l'objet -> extraction de l'URL avec "split".
        const filename = sauce.imageUrl.split("/images")[1];
        // Si, une image déjà présente -> suppression via le module "fs" avec "unlink".
        fs.unlink(`images/${filename}`, () => {
          // Mise à jour de la sauce avec "updateOne" via l'id ->
          // ajout d'un objet contenant les nouvelles valeurs pour la sauce "sauceObject".
          // L'opérateur spread ("...") est utilisé pour étendre l'objet "sauceObject" ->
          // et inclure l'identifiant de la sauce dans la requête de mise à jour.
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet modifié" });
            })
            .catch((error) => {
              throw error;
            });
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

// Affichage de toutes les sauces.
exports.getAllSauce = (req, res, next) => {
  // Récupération des objets via "find".
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Like et Dislike d'une sauce.
exports.likeASauce = (request, response, next) => {
  // Sélection de la sauce via "findOne".
  Sauce.findOne({ _id: request.params.id })
    .then((sauce) => {
      switch (request.body.like) {
        // Like = (+1)
        case 1:
          // Dans le cas ou l'array "usersLiked" ne contient pas encore le userId ->
          // de l'utilisateur qui like la sauce.
          if (!sauce.usersLiked.includes(request.body.userId) && request.body.like === 1) {
            // On met à jour la sauce en ayant incrémenter le like ->
            // puis on passe le userId dans l'array "usersLiked".
            Sauce.updateOne(
              { _id: request.params.id },
              { $inc: { likes: 1 }, $push: { usersLiked: request.body.userId } }
            )
              .then(() => {
                response.status(201).json({ message: "La sauce a été likée !" });
              })
              .catch((error) => {
                response.status(400).json({ error: error });
              });
          }
          break;
        // Dislike = (-1)
        case -1:
          if (!sauce.usersDisliked.includes(request.body.userId) && request.body.like === -1) {
            Sauce.updateOne(
              { _id: request.params.id },
              { $inc: { dislikes: 1 }, $push: { usersDisliked: request.body.userId } }
            )
              .then(() => {
                response.status(201).json({ message: "La sauce a été dislike !" });
              })
              .catch((error) => {
                response.status(400).json({ error: error });
              });
          }
          break;
        // Annulation du Like.
        case 0:
          if (sauce.usersLiked.includes(request.body.userId)) {
            Sauce.updateOne(
              { _id: request.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: request.body.userId } }
            )
              .then(() => {
                response.status(200).json({ message: "Le like de la sauce a été annulé !" });
              })
              .catch((error) => {
                response.status(400).json({ error });
              });
          }
          // Annulation du Dislike.
          if (sauce.usersDisliked.includes(request.body.userId)) {
            Sauce.updateOne(
              { _id: request.params.id },
              { $inc: { dislikes: -1 }, $pull: { usersDisliked: request.body.userId } }
            )
              .then(() => {
                response.status(200).json({ message: "Le dislike de la sauce a été annulé !" });
              })
              .catch((error) => {
                response.status(400).json({ error });
              });
          }
          break;
      }
    })
    .catch((error) => {
      response.status(404).json({ error });
    });
};
