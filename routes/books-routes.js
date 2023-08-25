const express = require("express");
const fileUpload = require("../middleware/file-upload");

const booksControllers = require("../controllers/books-controller");
const router = express.Router();

module.exports = router;

router.get("/:bookTitle", booksControllers.getBookSingle);

router.get("/", booksControllers.getBooks);

router.post("/", fileUpload.single("cover"), booksControllers.creatBook);

router.patch("/:bookId", fileUpload.single("cover"), booksControllers.updateBook);

router.delete("/:bookId", booksControllers.deleteBook);
