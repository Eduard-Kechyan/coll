const express = require("express");
const fileUpload = require("../middleware/file-upload");

const maControllers = require("../controllers/mas-controller");
const router = express.Router();

module.exports = router;

router.get("/:maTitle", maControllers.getMaSingle);

router.get("/", maControllers.getMas);

router.post("/", fileUpload.single("cover"), maControllers.creatMa);

router.patch("/:maId", fileUpload.single("cover"), maControllers.updateMa);

router.delete("/:maId", maControllers.deleteMa);
