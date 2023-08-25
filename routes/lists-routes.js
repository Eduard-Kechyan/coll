const express = require("express");

const listsControllers = require("../controllers/lists-controller");
const router = express.Router();

module.exports = router;

router.get("/:listTitle", listsControllers.getListSingle);

router.get("/", listsControllers.getLists);

router.post("/",  listsControllers.creatList);

router.patch("/:listId", listsControllers.updateList);

router.delete("/:listId", listsControllers.deleteList);