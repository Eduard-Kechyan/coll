const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  title: { type: String, required: true, unique: true },
  altTitle: { type: String },
  subTitle: { type: String },
  altSubTitle: { type: String },
  summary: { type: String, required: true },
  developer: { type: String, required: true },
  release: { type: String, required: true },
  genre: { type: String },
  rating: { type: String, required: true },
  cover: { type: String, required: true },
  links: { type: Array, required: true },
  platforms: { type: Array, required: true },
  serie: { type: String },
  isMobile: { type: Boolean },
  related: { type: String },
  options: { type: String },
});

gameSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Game", gameSchema);