// Importation du module "Express".
const express = require("express");
// Définition du router.
const router = express.Router();

// (1) Importation du module "sauceCtrl" -> gérer les actions liées aux sauces.
// (2) Importation du module "auth" -> gérer l'authentification des utilisateurs.
// (3) Importation du module "multer" -> gérer le téléchargements des images.
const sauceCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Définissions des routes avec une authenfication renforcée.
router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeASauce);

module.exports = router;
