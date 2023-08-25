const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Walk = require("../models/walk");

//Get walk
const getWalks = async (req, res, next) => {
  let walks;

  try {
    walks = await Walk.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting walks failed!", 500);
    return next(error);
  }

  res.json(walks);
};

//Get walk single
const getWalkSingle = async (req, res, next) => {
  let walk;

  try {
    walk = await Walk.findOne({ title: "" + req.params.walkTitle });
  } catch (err) {
    const error = new HttpError("[Error] Getting walk single failed!", 500);
    return next(error);
  }

  res.json(walk);
};

//Create a walk
const creatWalk = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("[Error] Invalid input data in walk creation!", 422)
    );
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

  let walkExists;
  try {
    walkExists = await Walk.findOne({ title: title });
  } catch (err) {
    const error = new HttpError("[Error] Finding existing walk failed!", 500);
    return next(error);
  }

  if (walkExists) {
    const error = new HttpError("[Error] Walk already exists!", 422);
    return next(error);
  }

  const walk = new Walk({
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
  });

  try {
    await walk.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("[Error] Creating walk failed!", 500);
    return next(error);
  }

  res.status(201).json(walk);
};

//Edit a walk
const updateWalk = async (req, res, next) => {
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
  const walkId = req.params.walkId;

  let walk;
  try {
    walk = await Walk.findById(walkId);
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating walk failed (when getting it)!",
      500
    );
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

//Remove a walk
const deleteWalk = async (req, res, next) => {
  const walkId = req.params.walkId;

  let walk;
  try {
    walk = await Walk.findById(walkId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Deleting walk failed (when getting it)!",
      500
    );
    return next(error);
  }

  if (!walk) {
    const error = new HttpError("[Error] Could not find walk to delete!", 500);
    return next(error);
  }

  try {
    await walk.remove();
  } catch (err) {
    const error = new HttpError(
      "[Error] Deleting walk failed (when removeing it)!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "[Succes] Walk deleted!" });
};
exports.getWalks = getWalks;
exports.creatWalk = creatWalk;
exports.deleteWalk = deleteWalk;
exports.getWalkSingle = getWalkSingle;
exports.updateWalk = updateWalk;
