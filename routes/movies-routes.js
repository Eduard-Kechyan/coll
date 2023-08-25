const express = require("express");
const fileUpload = require("../middleware/file-upload");

const moviesControllers = require("../controllers/movies-controller");
const router = express.Router();

module.exports = router;

router.get("/:movieTitle", moviesControllers.getMovieSingle);

router.get("/", moviesControllers.getMovies);

router.post("/", fileUpload.single("cover"), moviesControllers.creatMovie);

router.patch("/:movieId", fileUpload.single("cover"), moviesControllers.updateMovie);

router.delete("/:movieId", moviesControllers.deleteMovie);
