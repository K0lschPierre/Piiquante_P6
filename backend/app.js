// Importation des différents modules.
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

const dotenv = require("dotenv");
dotenv.config();

// Déclaration des constantes routers.
const userRoutes = require("./routes/user");
const saucesRoute = require("./routes/sauce");

// Déclaration de la constante "app".
const app = express();

// Middleware pour servir le dossier "images".
app.use("/images", express.static(path.join(__dirname, "images")));

// Sécurisation des en-têtes HTTP via "helmet".
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// Connexion a la base de données.
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Ajout pour éviter une erreur CORS.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(cors());

// Middleware pour l'extraction du corps JSON du frontend.
app.use(express.json());

// Enregistrement des routers.
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoute);

module.exports = app;
