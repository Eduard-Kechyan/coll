const express = require("express");
const { check } = require("express-validator");

const seriesControllers = require("../controllers/series-controller");
const router = express.Router();

module.exports = router;

router.get("/", seriesControllers.getSeries);

router.post("/", check("name").not().isEmpty(), seriesControllers.creatSerie);

router.patch(
  "/:serieId",
  check("name").not().isEmpty(),
  seriesControllers.updateSerie
);

router.delete("/:serieId", seriesControllers.deleteSerie);