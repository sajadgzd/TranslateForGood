const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

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
    },
    image:{
      type: String, 
      default: "images/default_photo.png",
      required: true,
    },
    requests:[{
      type: Schema.Types.ObjectId, // filled with the unique IDs of requests
      ref: "Request"
    }]
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);
// Mongoose automatically looks for the plural, lowercased version of your model name. So will be 'users'
module.exports = mongoose.model("User", UserSchema);
