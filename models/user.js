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
    proofRead:{
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
    }],
    matchedRequests: [{
      type: Schema.Types.ObjectId,
      ref: "Request"
    }],
    translationActivity: {
      accepted: [{
        type: Schema.Types.ObjectId, 
        ref: "Request"
      }],
      declined: [{
        type: Schema.Types.ObjectId, 
        ref: "Request"
      }],
      ignored: [{
        type: Schema.Types.ObjectId, 
        ref: "Request"
      }],
      acceptanceRate: {
        type: Number,
        default: function() {
          let total = this.translationActivity.accepted.length + this.translationActivity.declined.length + this.translationActivity.ignored.length;
          if (total == 0) {
            return 0;
          } else {
            return this.translationActivity.accepted.length/total;
          }
        },
      }

    }
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);
// Mongoose automatically looks for the plural, lowercased version of your model name. So will be 'users'
module.exports = mongoose.model("User", UserSchema);
