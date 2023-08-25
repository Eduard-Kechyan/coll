const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const maSchema = new Schema({
  title: { type: String, required: true, unique: true },
  altTitle: { type: String },
  subTitle: { type: String },
  altSubTitle: { type: String },
  summary: { type: String, required: true },
  author: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String},
  genre: { type: String },
  rating: { type: String },
  tags: { type: Array, required: true },
  cover: { type: String, required: true },
  chapters: { type: String, required: true },
  links: { type: Array, required: true },
  related: { type: String, },
  options: { type: String },
});

maSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ma", maSchema);
