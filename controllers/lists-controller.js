const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const List = require("../models/list");

//Get list
const getLists = async (req, res, next) => {
  let list;

  try {
    list = await List.find();
  } catch (err) {
    const error = new HttpError("[Error] Getting lists failed!", 500);
    return next(error);
  }

  res.json(list);
};

//Get list single
const getListSingle = async (req, res, next) => {
  let list;

  try {
    list = await List.findOne({ title: "" + req.params.listTitle });
  } catch (err) {
    const error = new HttpError("[Error] Getting list single failed!", 500);
    return next(error);
  }

  res.json(list);
};

//Create a list
const creatList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("[Error] Invalid input data in list creation!", 422)
    );
  }

  const {
    title,
    favourite,
    items
  } = req.body;

  let listExists;
  try {
    listExists = await List.findOne({ title: title });
  } catch (err) {
    const error = new HttpError("[Error] Finding existing list failed!", 500);
    return next(error);
  }

  if (listExists) {
    const error = new HttpError("[Error] List already exists!", 422);
    return next(error);
  }

  const list = new List({
    title,
    favourite,
    items
  });

  try {
    await list.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("[Error] Creating list serie failed!", 500);
    return next(error);
  }

  res.status(201).json(list);
};

//Edit a list
const updateList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    new HttpError("[Error] Invalid input data in list updating!", 422);
  }

  const {
    title,
    favourite,
    items
  } = req.body;
  const listId = req.params.listId;

  let list;
  try {
    list = await List.findById(listId);
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating list failed (when getting it)!",
      500
    );
    return next(error);
  }


  list.title = title;
  list.favourite = favourite;
  list.items = items;

  try {
    await list.save();
  } catch (err) {
    const error = new HttpError(
      "[Error] Updating list failed {when saving it}!",
      500
    );
    return next(error);
  }

  res.status(200).json(list);
};

//Remove a list
const deleteList = async (req, res, next) => {
  const listId = req.params.listId;

  let list;
  try {
    list = await List.findById(listId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "[Error] Deleting list failed (when getting it)!",
      500
    );
    return next(error);
  }

  if (!list) {
    const error = new HttpError("[Error] Could not find list to delete!", 500);
    return next(error);
  }

  try {
    await list.remove();
  } catch (err) {
    const error = new HttpError(
      "[Error] Deleting list failed (when removeing it)!",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "[Succes] List deleted!" });
};
exports.getLists = getLists;
exports.creatList = creatList;
exports.deleteList = deleteList;
exports.getListSingle = getListSingle;
exports.updateList = updateList;