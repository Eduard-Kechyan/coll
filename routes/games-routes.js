const express = require("express");
const fileUpload = require("../middleware/file-upload");

const gamesControllers = require("../controllers/games-controller");
const router = express.Router();

module.exports = router;

router.get("/:gameTitle", gamesControllers.getGameSingle);

router.get("/", gamesControllers.getGames);

router.post("/", fileUpload.single("cover"), gamesControllers.creatGame);

router.patch("/:gameId", fileUpload.single("cover"), gamesControllers.updateGame);

router.delete("/:gameId", gamesControllers.deleteGame);