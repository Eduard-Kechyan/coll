const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Walk = require("../models/walk");

//Get walks
const getAlts = async (req, res, next) => {
  let walks;

  try {
    walks = await Walk.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting walks failed!", 500);
    return next(error);
  }

  res.json(walks);
};

//Get walk single by id
const getAltSingle = async (req, res, next) => {
  let walk;

  try {
    walk = await Walk.findOne({ vndb: req.params.altId });
  } catch (err) {
    const error = new HttpError("[Error] Getting alt/walk  single by id failed!", 500);
    return next(error);
  }

  res.json(walk);
};

//Edit a walk
const updateAlt = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("[Error] Invalid input data in walk updating!", 422);
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    description,
    summary,
    relatedVn,
    source,
    vndb,
    options,
    content,
  } = req.body;

  let walk;
  try {
    walk = await Walk.findOne({ vndb: req.params.altId });
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating walk failed (when getting it)!",
      500
    );
    console.log(err);
    return next(error);
  }

  walk.title = title;
  walk.altTitle = altTitle;
  walk.subTitle = subTitle;
  walk.altSubTitle = altSubTitle;
  walk.description = description;
  walk.summary = summary;
  walk.relatedVn = relatedVn;
  walk.source = source;
  walk.vndb = vndb;
  walk.options = options;
  walk.content = content;

  try {
    await walk.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Updating walk failed {when updating it}!",
      500
    );
    return next(error);
  }

  res.status(200).json(walk);
};


exports.getAlts = getAlts;
exports.getAltSingle = getAltSingle;
exports.updateAlt = updateAlt;

