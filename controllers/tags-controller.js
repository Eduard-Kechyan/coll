const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Tag = require("../models/tag");

//Get tag
const getTags = async (req, res, next) => {
  let tags;

  try {
    tags = await Tag.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting tags failed!", 500);
    return next(error);
  }

  res.json(tags);
};

//Create tag
const creatTag = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("[Error] Invalid input data in tag creation!", 422)
    );
  }

  const { name, media } = req.body;

  let tagExists;
  try {
    tagExists = await Tag.findOne({ name: name });
  } catch (err) {
    const error = new HttpError("[Error] Finding existing tag failed!", 500);
    return next(error);
  }

  if (tagExists) {
    const error = new HttpError("[Error] Tag already exists!", 422);
    return next(error);
  }

  const tag = new Tag({
    name,
    media,
  });

  try {
    await tag.save();
  } catch (err) {
    const error = new HttpError("[Error] Creating tag failed!", 500);
    return next(error);
  }

  res.status(201).json(tag);
};

//Edit tag
const updateTag = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("[Error] Invalid input data in tag updating!", 422);
  }

  const { name, media } = req.body;
  const tagId = req.params.tagId;

  let tag;
  try {
    tag = await Tag.findById(tagId);
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating tag failed (when getting it)!",
      500
    );
    return next(error);
  }

  tag.name = name;
  tag.media = media;

  try {
    await tag.save();
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating tag failed {when saving it}!",
      500
    );
    return next(error);
  }

  res.status(200).json(tag);
};

//Remove tag
const deleteTag = async (req, res, next) => {
  const tagId = req.params.tagId;

  let tag;
  try {
    tag = await Tag.findById(tagId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Deleting tag failed (when getting it)!",
      500
    );
    return next(error);
  }

  if (!tag) {
    const error = new HttpError("[Error] Could not find tag to delete!", 500);
    return next(error);
  }

  try {
    await tag.remove();
  } catch (err) {
    const error = new HttpError(
      "[Error] Deleting tag failed (when removeing it)!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "[Succes] Tag deleted!" });
};

exports.getTags = getTags;
exports.creatTag = creatTag;
exports.updateTag = updateTag;
exports.deleteTag = deleteTag;
