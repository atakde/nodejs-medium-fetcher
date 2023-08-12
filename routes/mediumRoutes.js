const express = require("express");
const path = require('path');
const router = express.Router();
const mediumController = require("../controllers/mediumController");

router.get("/", mediumController.getArticles);
router.get("/generator", (req, res) => {
    res.sendFile(path.join(__dirname + ' /../index.html'));
});

module.exports = router;
