const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const listSchema = new Schema({
  title: { type: String, required: true, unique: true },
  favourite: { type: Boolean },
  items: { type: String },
});

listSchema.plugin(uniqueValidator);

module.exports = mongoose.model("List", listSchema);