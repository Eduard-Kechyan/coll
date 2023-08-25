const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const Movie = require("../models/movie");

//Get movie
const getMovies = async (req, res, next) => {
  let movie;

  try {
    movie = await Movie.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting movies failed!", 500);
    return next(error);
  }

  res.json(movie);
};

//Get movie single
const getMovieSingle = async (req, res, next) => {
  let movie;

  try {
    movie = await Movie.findOne({ title: "" + req.params.movieTitle });
  } catch (err) {
    const error = new HttpError("[Error] Getting movie single failed!", 500);
    return next(error);
  }

  res.json(movie);
};

//Create a movie
const creatMovie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("[Error] Invalid input data in movie creation!", 422)
    );
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    producer,
    release,
    runTime,
    rating,
    genre,
    tags,
    links,
    serie,
    episodes,
    isAnimated,
    isAn,
    isSerie,
    related,
    options,
  } = req.body;

  let movieExists;
  try {
    movieExists = await Movie.findOne({ title: title });
  } catch (err) {
    const error = new HttpError("[Error] Finding existing movie failed!", 500);
    return next(error);
  }

  if (movieExists) {
    const error = new HttpError("[Error] Movie already exists!", 422);
    return next(error);
  }

  const movie = new Movie({
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    producer,
    release,
    runTime,
    genre,
    tags,
    cover: req.file.path,
    rating,
    links,
    serie,
    episodes,
    isAnimated,
    isAn,
    isSerie,
    related,
    options,
  });

  try {
    await movie.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("[Error] Creating movie serie failed!", 500);
    return next(error);
  }

  res.status(201).json(movie);
};

//Edit a movie
const updateMovie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("[Error] Invalid input data in movie updating!", 422);
  }

  const {
    title,
    altTitle,
    subTitle,
    altSubTitle,
    summary,
    producer,
    release,
    runTime,
    rating,
    genre,
    tags,
    links,
    serie,
    episodes,
    isAnimated,
    isAn,
    isSerie,
    related,
    options,
  } = req.body;
  const movieId = req.params.movieId;

  let movie;
  try {
    movie = await Movie.findById(movieId);
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating movie failed (when getting it)!",
      500
    );
    return next(error);
  }

  let oldCover = movie.cover;

  movie.title = title;
  movie.altTitle = altTitle;
  movie.subTitle = subTitle;
  movie.altSubTitle = altSubTitle;
  movie.summary = summary;
  movie.producer = producer;
  movie.release = release;
  movie.runTime = runTime;
  movie.genre = genre;
  movie.tags = tags;
  movie.rating = rating;
  movie.links = links;
  movie.serie = serie;
  movie.episodes = episodes;
  movie.isAnimated = isAnimated;
  movie.isAn = isAn;
  movie.isSerie = isSerie;
  movie.related = related;
  movie.options = options;

  if (req.file !== undefined) {
    movie.cover = req.file.path;
  }

  try {
    if (req.file !== undefined) {
      fs.unlink(oldCover, (err) => {
        if (err) throw err;
      });
    }

    await movie.save();
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating movie failed {when saving it}!",
      500
    );
    return next(error);
  }

  res.status(200).json(movie);
};

//Remove a movie
const deleteMovie = async (req, res, next) => {
  const movieId = req.params.movieId;

  let movie;
  try {
    movie = await Movie.findById(movieId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Deleting movie failed (when getting it)!",
      500
    );
    return next(error);
  }

  if (!movie) {
    const error = new HttpError("[Error] Could not find movie to delete!", 500);
    return next(error);
  }

  try {
    fs.unlink(movie.cover, (err) => {
      if (err) throw err;
    });

    await movie.remove();
  } catch (err) {
    const error = new HttpError(
      "[Error] Deleting movie failed (when removeing it)!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "[Succes] Movie deleted!" });
};
exports.getMovies = getMovies;
exports.creatMovie = creatMovie;
exports.deleteMovie = deleteMovie;
exports.getMovieSingle = getMovieSingle;
exports.updateMovie = updateMovie;