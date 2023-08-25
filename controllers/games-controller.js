const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const Game = require("../models/game");

//Get game
const getGames = async (req, res, next) => {
  let game;

  try {
    game = await Game.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting games failed!", 500);
    return next(error);
  }

  res.json(game);
};

//Get game single
const getGameSingle = async (req, res, next) => {
  let game;

  try {
    game = await Game.findOne({ title: "" + req.params.gameTitle });
  } catch (err) {
    const error = new HttpError("[Error] Getting game single failed!", 500);
    return next(error);
  }

  res.json(game);
};

//Create a game
const creatGame = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("[Error] Invalid input data in game creation!", 422)
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
    rating,
    genre,
    links,
    serie,
    platforms,
    isMobile,
    related,
    options,
  } = req.body;

  let gameExists;
  try {
    gameExists = await Game.findOne({ title: title });
  } catch (err) {
    const error = new HttpError("[Error] Finding existing game failed!", 500);
    return next(error);
  }

  if (gameExists) {
    const error = new HttpError("[Error] Game already exists!", 422);
    return next(error);
  }

  const game = new Game({
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    developer,
    release,
    genre,
    cover: req.file.path,
    rating,
    links,
    serie,
    platforms,
    isMobile,
    related,
    options,
  });

  try {
    await game.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("[Error] Creating game serie failed!", 500);
    return next(error);
  }

  res.status(201).json(game);
};

//Edit a game
const updateGame = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("[Error] Invalid input data in game updating!", 422);
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    developer,
    release,
    rating,
    genre,
    links,
    serie,
    platforms,
    isMobile,
    related,
    options,
  } = req.body;
  const gameId = req.params.gameId;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating game failed (when getting it)!",
      500
    );
    return next(error);
  }

  let oldCover = game.cover;

  game.title = title;
  game.altTitle = altTitle;
  game.subTitle = subTitle;
  game.altSubTitle = altSubTitle;
  game.summary = summary;
  game.developer = developer;
  game.release = release;
  game.genre = genre;
  game.rating = rating;
  game.links = links;
  game.serie = serie;
  game.platforms = platforms;
  game.isMobile = isMobile;
  game.related = related;
  game.options = options;

  if (req.file !== undefined) {
    game.cover = req.file.path;
  }

  try {
    if (req.file !== undefined) {
      fs.unlink(oldCover, (err) => {
        if (err) throw err;
      });
    }

    await game.save();
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating game failed {when saving it}!",
      500
    );
    return next(error);
  }

  res.status(200).json(game);
};

//Remove a game
const deleteGame = async (req, res, next) => {
  const gameId = req.params.gameId;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Deleting game failed (when getting it)!",
      500
    );
    return next(error);
  }

  if (!game) {
    const error = new HttpError("[Error] Could not find game to delete!", 500);
    return next(error);
  }

  try {
    fs.unlink(game.cover, (err) => {
      if (err) throw err;
    });

    await game.remove();
  } catch (err) {
    const error = new HttpError(
      "[Error] Deleting game failed (when removeing it)!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "[Succes] Game deleted!" });
};
exports.getGames = getGames;
exports.creatGame = creatGame;
exports.deleteGame = deleteGame;
exports.getGameSingle = getGameSingle;
exports.updateGame = updateGame;
