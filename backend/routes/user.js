const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const password = require("../middleware/password");
const emailValidator = require("../middleware/emailValidator");
const limiter = require("../middleware/rate-limiter");

router.post("/signup", emailValidator, password, limiter, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

module.exports = router;
