const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    languageFrom:{
      type: [],
      requred: true,
    },
    languageTo:{
      type: [],
      requred: true,
    },
    femaleTranslator:{
      type: Boolean,
      default: false,
      requred: true,
    },
    timezone:{
      type: String,
      requred: true,
    }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);
// Mongoose automatically looks for the plural, lowercased version of your model name. So will be 'users'
module.exports = mongoose.model("User", UserSchema);
