const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const Vn = require("../models/vn");

//Get vn
const getVns = async (req, res, next) => {
  let vn;

  try {
    vn = await Vn.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting vns failed!", 500);
    return next(error);
  }

  res.json(vn);
};

//Get vn single
const getVnSingle = async (req, res, next) => {
  let vn;

  try {
    vn = await Vn.findOne({ title: "" + req.params.vnTitle });
  } catch (err) {
    const error = new HttpError("[Error] Getting vn single failed!", 500);
    return next(error);
  }

  res.json(vn);
};

//Create a vn
const creatVn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("[Error] Invalid input data in vn creation!", 422)
    );
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    developer,
    release,
    vndb,
    duration,
    rating,
    genre,
    tags,
    links,
    volumes,
    related,
    options,
  } = req.body;

  let vnExists;
  try {
    vnExists = await Vn.findOne({ title: title });
  } catch (err) {
    const error = new HttpError("[Error] Finding existing vn failed!", 500);
    return next(error);
  }

  if (vnExists) {
    const error = new HttpError("[Error] Vn already exists!", 422);
    return next(error);
  }

  const vn = new Vn({
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    developer,
    release,
    genre,
    tags,
    cover: req.file.path,
    vndb,
    duration,
    rating,
    volumes,
    links,
    related,
    options,
  });

  try {
    await vn.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("[Error] Creating vn serie failed!", 500);
    return next(error);
  }

  res.status(201).json(vn);
};

//Edit a vn
const updateVn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("[Error] Invalid input data in vn updating!", 422);
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    developer,
    release,
    vndb,
    duration,
    rating,
    genre,
    tags,
    links,
    volumes,
    related,
    options,
  } = req.body;
  const vnId = req.params.vnId;

  let vn;
  try {
    vn = await Vn.findById(vnId);
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating vn failed (when getting it)!",
      500
    );
    return next(error);
  }

  let oldCover = vn.cover;

  vn.title = title;
  vn.altTitle = altTitle;
  vn.subTitle = subTitle;
  vn.altSubTitle = altSubTitle;
  vn.summary = summary;
  vn.developer = developer;
  vn.run = release;
  vn.genre = genre;
  vn.tags = tags;
  vn.vndb = vndb;
  vn.duration = duration;
  vn.rating = rating;
  vn.volumes = volumes;
  vn.links = links;
  vn.related = related;
  vn.options = options;

  if (req.file !== undefined) {
    vn.cover = req.file.path;
  }

  try {
    if (req.file !== undefined) {
      fs.unlink(oldCover, (err) => {
        if (err) throw err;
      });
    }

    await vn.save();
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating vn failed {when saving it}!",
      500
    );
    return next(error);
  }

  res.status(200).json(vn);
};

//Remove a vn
const deleteVn = async (req, res, next) => {
  const vnId = req.params.vnId;

  let vn;
  try {
    vn = await Vn.findById(vnId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Deleting vn failed (when getting it)!",
      500
    );
    return next(error);
  }

  if (!vn) {
    const error = new HttpError("[Error] Could not find vn to delete!", 500);
    return next(error);
  }

  try {
    fs.unlink(vn.cover, (err) => {
      if (err) throw err;
    });

    await vn.remove();
  } catch (err) {
    const error = new HttpError(
      "[Error] Deleting vn failed (when removeing it)!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "[Succes] Vn deleted!" });
};
exports.getVns = getVns;
exports.creatVn = creatVn;
exports.deleteVn = deleteVn;
exports.getVnSingle = getVnSingle;
exports.updateVn = updateVn;
