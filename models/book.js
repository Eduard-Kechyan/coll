const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true, unique: true },
  altTitle: { type: String },
  subTitle: { type: String },
  altSubTitle: { type: String },
  summary: { type: String, required: true },
  author: { type: String, required: true },
  release: { type: String, required: true },
  genre: { type: String },
  rating: { type: String, required: true },
  tags: { type: Array, required: true },
  cover: { type: String, required: true },
  links: { type: Array, required: true },
  serie: { type: String },
  chapters: { type: String },
  isLight: { type: Boolean },
  related: { type: String },
  options: { type: String },
});

bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Book", bookSchema);
