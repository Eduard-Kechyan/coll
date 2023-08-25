const express = require("express");
const fileUpload = require("../middleware/file-upload");

const vnsControllers = require("../controllers/vns-controller");
const router = express.Router();

module.exports = router;

router.get("/:vnTitle", vnsControllers.getVnSingle);

router.get("/", vnsControllers.getVns);

router.post("/", fileUpload.single("cover"), vnsControllers.creatVn);

router.patch("/:vnId", fileUpload.single("cover"), vnsControllers.updateVn);

router.delete("/:vnId", vnsControllers.deleteVn);
