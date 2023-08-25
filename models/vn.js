const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const vnSchema = new Schema({
  title: { type: String, required: true, unique: true },
  altTitle: { type: String },
  subTitle: { type: String },
  altSubTitle: { type: String },
  summary: { type: String, required: true },
  developer: { type: String, required: true },
  release: { type: String, required: true },
  vndb: { type: String, required: true },
  duration: { type: String, required: true },
  genre: { type: String },
  rating: { type: String, required: true },
  tags: { type: Array, required: true },
  cover: { type: String, required: true },
  links: { type: Array, required: true },
  related: { type: String, },
  options: { type: String },
});

vnSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Vn", vnSchema);
