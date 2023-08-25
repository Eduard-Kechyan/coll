const express = require("express");

const walksControllers = require("../controllers/walks-controller");
const router = express.Router();

module.exports = router;

router.get("/:walkTitle", walksControllers.getWalkSingle);

router.get("/", walksControllers.getWalks);

router.post("/", walksControllers.creatWalk);

router.patch("/:walkId", walksControllers.updateWalk);

router.delete("/:walkId", walksControllers.deleteWalk);
