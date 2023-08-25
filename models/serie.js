const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const serieSchema = new Schema({
  name: { type: String, required: true, unique: true },
  media: { type: String, required: true },
});

serieSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Serie", serieSchema);