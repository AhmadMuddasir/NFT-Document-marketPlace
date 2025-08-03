const express = require("express");
const authController = require("../Controllers/authController");
const router = express.Router();

router.route("/").post(authController.signUp);
router.route("/").post(authController.login);

router.post("/signup",authController.signUp);

router.post("/login",authController.login);


module.exports =  router;
