const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: { type: String, required: true, unique: true },
  altTitle: { type: String },
  subTitle: { type: String },
  altSubTitle: { type: String },
  summary: { type: String, required: true },
  producer: { type: String, required: true },
  release: { type: String, required: true },
  runTime: { type: String, required: true },
  genre: { type: String },
  rating: { type: String, required: true },
  tags: { type: Array, required: true },
  cover: { type: String, required: true },
  links: { type: Array, required: true },
  serie: { type: String },
  episodes: { type: String },
  isAnimated: { type: Boolean },
  isAn: { type: Boolean },
  isSerie: { type: Boolean },
  related: { type: String },
  options: { type: String },
});

movieSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Movie", movieSchema);
