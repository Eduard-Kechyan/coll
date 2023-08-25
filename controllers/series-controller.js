const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Serie = require("../models/serie");

//Get serie
const getSeries = async (req, res, next) => {
  let series;

  try {
    series = await Serie.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting series failed!", 500);
    return next(error);
  }

  res.json(series);
};

//Create serie
const creatSerie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("[Error] Invalid input data in serie creation!", 422)
    );
  }

  const { name, media } = req.body;

  let serieExists;
  try {
    serieExists = await Serie.findOne({ name: name });
  } catch (err) {
    const error = new HttpError("[Error] Finding existing serie failed!", 500);
    return next(error);
  }

  if (serieExists) {
    const error = new HttpError("[Error] Serie already exists!", 422);
    return next(error);
  }

  const serie = new Serie({
    name,
    media,
  });

  try {
    await serie.save();
  } catch (err) {
    const error = new HttpError("[Error] Creating serie failed!", 500);
    return next(error);
  }

  res.status(201).json(serie);
};

//Edit serie
const updateSerie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("[Error] Invalid input data in serie updating!", 422);
  }

  const { name, media } = req.body;
  const serieId = req.params.serieId;

  let serie;
  try {
    serie = await Serie.findById(serieId);
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating serie failed (when getting it)!",
      500
    );
    return next(error);
  }

  serie.name = name;
  serie.media = media;

  try {
    await serie.save();
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating serie failed {when saving it}!",
      500
    );
    return next(error);
  }

  res.status(200).json(serie);
};

//Remove serie
const deleteSerie = async (req, res, next) => {
  const serieId = req.params.serieId;

  let serie;
  try {
    serie = await Serie.findById(serieId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Deleting serie failed (when getting it)!",
      500
    );
    return next(error);
  }

  if (!serie) {
    const error = new HttpError("[Error] Could not find serie to delete!", 500);
    return next(error);
  }

  try {
    await serie.remove();
  } catch (err) {
    const error = new HttpError(
      "[Error] Deleting serie failed (when removeing it)!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "[Succes] Serie deleted!" });
};

exports.getSeries = getSeries;
exports.creatSerie = creatSerie;
exports.updateSerie = updateSerie;
exports.deleteSerie = deleteSerie;