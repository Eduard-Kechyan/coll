const express = require("express");
const { check } = require("express-validator");

const tagsControllers = require("../controllers/tags-controller");
const router = express.Router();

module.exports = router;

router.get("/", tagsControllers.getTags);

router.post("/", check("name").not().isEmpty(), tagsControllers.creatTag);

router.patch(
  "/:tagId",
  check("name").not().isEmpty(),
  tagsControllers.updateTag
);

router.delete("/:tagId", tagsControllers.deleteTag);
