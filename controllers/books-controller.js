const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const Book = require("../models/book");

//Get book
const getBooks = async (req, res, next) => {
  let book;

  try {
    book = await Book.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting books failed!", 500);
    return next(error);
  }

  res.json(book);
};

//Get book single
const getBookSingle = async (req, res, next) => {
  let book;

  try {
    book = await Book.findOne({ title: "" + req.params.bookTitle });
  } catch (err) {
    const error = new HttpError("[Error] Getting book single failed!", 500);
    return next(error);
  }

  res.json(book);
};

//Create a book
const creatBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("[Error] Invalid input data in book creation!", 422)
    );
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    author,
    release,
    rating,
    genre,
    serie,
    tags,
    links,
    chapters,
    isLight,
    related,
    options,
  } = req.body;

  let bookExists;
  try {
    bookExists = await Book.findOne({ title: title });
  } catch (err) {
    const error = new HttpError("[Error] Finding existing book failed!", 500);
    return next(error);
  }

  if (bookExists) {
    const error = new HttpError("[Error] Book already exists!", 422);
    return next(error);
  }

  const book = new Book({
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    author,
    release,
    genre,
    serie,
    tags,
    cover: req.file.path,
    rating,
    links,
    chapters,
    isLight,
    related,
    options,
  });

  try {
    await book.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("[Error] Creating book serie failed!", 500);
    return next(error);
  }

  res.status(201).json(book);
};

//Edit a book
const updateBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("[Error] Invalid input data in book updating!", 422);
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    author,
    release,
    rating,
    genre,
    serie,
    tags,
    links,
    chapters,
    isLight,
    related,
    options,
  } = req.body;
  const bookId = req.params.bookId;

  let book;
  try {
    book = await Book.findById(bookId);
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating book failed (when getting it)!",
      500
    );
    return next(error);
  }

  let oldCover = book.cover;

  book.title = title;
  book.altTitle = altTitle;
  book.subTitle = subTitle;
  book.altSubTitle = altSubTitle;
  book.summary = summary;
  book.author = author;
  book.release = release;
  book.genre = genre;
  book.serie = serie;
  book.tags = tags;
  book.rating = rating;
  book.links = links;
  book.chapters = chapters;
  book.isLight = isLight;
  book.related = related;
  book.options = options;

  if (req.file !== undefined) {
    book.cover = req.file.path;
  }

  try {
    if (req.file !== undefined) {
      fs.unlink(oldCover, (err) => {
        if (err) throw err;
      });
    }

    await book.save();
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating book failed {when saving it}!",
      500
    );
    return next(error);
  }

  res.status(200).json(book);
};

//Remove a book
const deleteBook = async (req, res, next) => {
  const bookId = req.params.bookId;

  let book;
  try {
    book = await Book.findById(bookId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Deleting book failed (when getting it)!",
      500
    );
    return next(error);
  }

  if (!book) {
    const error = new HttpError("[Error] Could not find book to delete!", 500);
    return next(error);
  }

  try {
    fs.unlink(book.cover, (err) => {
      if (err) throw err;
    });

    await book.remove();
  } catch (err) {
    const error = new HttpError(
      "[Error] Deleting book failed (when removeing it)!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "[Succes] Book deleted!" });
};
exports.getBooks = getBooks;
exports.creatBook = creatBook;
exports.deleteBook = deleteBook;
exports.getBookSingle = getBookSingle;
exports.updateBook = updateBook;