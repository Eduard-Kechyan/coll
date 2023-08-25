const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const walkSchema = new Schema({
  title: { type: String, required: true, unique: true },
  altTitle: { type: String },
  subTitle: { type: String },
  altSubTitle: { type: String },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  relatedVn: { type: String, required: true },
  source: { type: String, required: true },
  vndb: { type: String, required: true },
  options: { type: String },
  content: { type: String },
});

walkSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Walk", walkSchema);
