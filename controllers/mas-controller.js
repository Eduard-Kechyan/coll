const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const Ma = require("../models/ma");

//Get ma
const getMas = async (req, res, next) => {
  let mas;

  try {
    mas = await Ma.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting mas failed!", 500);
    return next(error);
  }

  res.json(mas);
};

//Get ma single
const getMaSingle = async (req, res, next) => {
  let ma;

  try {
    ma = await Ma.findOne({ title: "" + req.params.maTitle });
  } catch (err) {
    const error = new HttpError("[Error] Getting ma single failed!", 500);
    return next(error);
  }

  res.json(ma);
};

//Create a ma
const creatMa = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("[Error] Invalid input data in ma creation!", 422)
    );
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    author,
    from,
    to,
    genre,
    rating,
    tags,
    chapters,
    links,
    related,
    options,
  } = req.body;

  let maExists;
  try {
    maExists = await Ma.findOne({ title: title });
  } catch (err) {
    const error = new HttpError("[Error] Finding existing ma failed!", 500);
    return next(error);
  }

  if (maExists) {
    const error = new HttpError("[Error] Ma already exists!", 422);
    return next(error);
  }

  const ma = new Ma({
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    author,
    from,
    to,
    genre,
    rating,
    tags,
    cover: req.file.path,
    chapters,
    links,
    related,
    options,
  });

  try {
    await ma.save();
  } catch (err) {
    const error = new HttpError("[Error] Creating ma failed!", 500);
    return next(error);
  }

  res.status(201).json(ma);
};

//Edit a ma
const updateMa = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("[Error] Invalid input data in ma updating!", 422);
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    author,
    from,
    to,
    genre,
    rating,
    tags,
    chapters,
    links,
    related,
    options,
  } = req.body;
  const maId = req.params.maId;

  let ma;
  try {
    ma = await Ma.findById(maId);
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating ma failed (when getting it)!",
      500
    );
    return next(error);
  }

  let oldCover = ma.cover;

  ma.title = title;
  ma.altTitle = altTitle;
  ma.subTitle = subTitle;
  ma.altSubTitle = altSubTitle;
  ma.summary = summary;
  ma.author = author;
  ma.from = from;
  ma.to = to;
  ma.genre = genre;
  ma.rating = rating;
  ma.tags = tags;
  ma.chapters = chapters;
  ma.links = links;
  ma.related = related;
  ma.options = options;

  if (req.file !== undefined) {
    ma.cover = req.file.path;
  }

  try {
    if (req.file !== undefined) {
      fs.unlink(oldCover, (err) => {
        if (err) throw err;
      });
    }

    await ma.save();
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating ma failed {when saving it}!",
      500
    );
    return next(error);
  }

  res.status(200).json(ma);
};

//Remove a ma
const deleteMa = async (req, res, next) => {
  const maId = req.params.maId;

  let ma;
  try {
    ma = await Ma.findById(maId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Deleting ma failed (when getting it)!",
      500
    );
    return next(error);
  }

  if (!ma) {
    const error = new HttpError("[Error] Could not find ma to delete!", 500);
    return next(error);
  }

  try {
    fs.unlink(ma.cover, (err) => {
      if (err) throw err;
    });

    await ma.remove();
  } catch (err) {
    const error = new HttpError(
      "[Error] Deleting ma failed (when removeing it)!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "[Succes] Ma deleted!" });
};
exports.getMas = getMas;
exports.creatMa = creatMa;
exports.deleteMa = deleteMa;
exports.getMaSingle = getMaSingle;
exports.updateMa = updateMa;
