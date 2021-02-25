const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const RequestSchema = new mongoose.Schema(
  { 
    user:{
      type: String,
      default: "",
    },
    languageFrom: {
      type: String,
      trim: true,
      required: true,
    },
    languageTo: {
      type: String,
      trim: true,
      required: true,
    },
    urgentTranslation: {
      type: Boolean,
      default: false,
      // required: true,
    },
    femaleTranslator:{
      type: Boolean,
      default: false,
      // required: true,
    },
    documentProofreading:{
      type: Boolean,
      default: false,
      // required: true,
    },
    isActive:{
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

RequestSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Request", RequestSchema);
