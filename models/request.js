const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const RequestSchema = new mongoose.Schema(
  { 
    author:{
      type: Schema.Types.ObjectId, 
      ref: 'User'
    },
    matchedTranslators: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
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
    dueDateTime: {
      type: Date,
      required: true,
    },
    femaleTranslator:{
      type: Boolean,
      default: false,
    },
    documentProofreading:{
      type: Boolean,
      default: false,
    },
    isActive:{
      type: Boolean,
      default: true,
    },
    acceptedTranslator:{
      type: Schema.Types.ObjectId, 
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
