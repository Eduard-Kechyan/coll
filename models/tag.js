const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: { type: String, required: true, unique: true, lowercase: true },
  media: { type: String, required: true },
});

tagSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Tag", tagSchema);
