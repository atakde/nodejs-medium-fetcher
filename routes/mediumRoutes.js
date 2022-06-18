const express = require("express");
const router = express.Router();
const mediumController = require("../controllers/mediumController");

router.get("/", mediumController.getArticles);

module.exports = router;
