const express = require("express");

const walksControllers = require("../controllers/alt-controller");
const router = express.Router();

module.exports = router;

router.get("/:altId", walksControllers.getAltSingle);

router.get("/", walksControllers.getAlts);

router.patch("/:altId", walksControllers.updateAlt);
