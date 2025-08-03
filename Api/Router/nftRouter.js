const express = require("express");
const nftController = require("../Controllers/nftController");
const router = express.Router();

router.route("/").get(nftController.getAllNfts).post(nftController.createNft);
router.route("/profile").get(nftController.getAllNfts);

router.route("/:id").get(nftController.getNft);

module.exports = router;