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
      type: String,
      requred: true,
    },
    languageTo:{
      type: String,
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
module.exports = mongoose.model("User", UserSchema);
