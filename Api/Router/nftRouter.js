const express = require("express");
const nftController = require("../Controllers/nftController");
const router = express.Router();

router.route("/").get(nftController.getAllNfts).post(nftController.createNft);
router.route("/profile").get(nftController.getAllNfts);

router.route("/:id").get(nftController.getNft);

module.exports = router;

// const express = require("express");
// const authController = require("../Controllers/authController");
// const router = express.Router();

// router.post("/signup",authController.signUp);

// router.post("/login",authController.login);


// module.exports =  router;